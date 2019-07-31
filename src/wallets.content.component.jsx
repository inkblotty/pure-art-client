import React from 'react';

import { Button, message, Modal, Popconfirm, Table } from 'antd';

import { clipboard } from 'electron';

import Constants from './logic/constants';
import CreateForm from './create.form.modal.component';
import CreateTransaction from './create.transaction.modal.component';
import Hasher from './logic/hasher.util';
import { Wallet2, WalletUpdated } from './logic/wallet.js';
import { blockcypher } from './logic/blockchainApi/blockcypher';

const blockchainApi = blockcypher
// Helper Functions

const validateFormHashed = (form) => {
    return new Promise((res, rej) => {
        form.validateFields((err, values) => {
            if (err) rej(err);
            Hasher.hash(values.password).then((hash) => {
                values.password = hash;
                res(values);
            }, (e) => {
                rej(e);
            });
        });
    });
};

const formatAmount = (amount) => {
    const nf = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return nf.format(amount);
};

class WalletsContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpenCreate: false,
            modalOpenSend: false,
            price: 1.0,
            total: 0.0,
            wallets: [],
            sendingPayment: false,
            sourceWallet: null,
        };

        this.handleCreate = this.handleCreate.bind(this);
        this.handleSendit = this.handleSendit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }

    componentDidMount() {
        blockchainApi.getPrice('USD').then((r) => {
            this.setState({ price: r.sell });
        }).catch((e) => {
            console.log(e);
        });

        blockchainApi.getFee('BTC').then((fee) => {
            console.log(fee);
            this.fee = fee;
        }).catch((e) => {
            console.log('Could not get fee ', e);
        });


        Wallet2.all('BTC').then((wallets) => {
            wallets.forEach((w) => {
                w.on(WalletUpdated, () => {
                    const newTotal = this.state.wallets.reduce((a, c) => a + c.coins, 0);
                    this.setState({ total: newTotal });
                });
                w.update(blockchainApi);
            });

            this.setState({ wallets: wallets });

        }, (e) => {
            console.log(e);
            message.error('Could not load wallets from database');
        });
    }

    handleCreate() {

        validateFormHashed(this.form).then((values) => {
            this.form.resetFields();
            this.setState({ modalOpenCreate: false });

            const mnemonic = Wallet2.generate();
            debugger
            const wallet = Wallet2.create(values.asset.toUpperCase(), values.name, mnemonic, values.password);

            this.__addWallet(wallet, mnemonic);
        });

    }

    __addWallet(wallet, mnemonic) {

        this.setState({
            wallets: this.state.wallets.concat([wallet]),
        });

        wallet.save().then(() => {

            message.success(Constants.Messages.Wallet.Created);

            setTimeout(() => {
                Modal.warning({
                    title: Constants.Messages.Wallet.Mnemonic,
                    content: mnemonic,
                });
            }, 1000);

        }, (e) => {
            Modal.error({
                title: Constants.Messages.Wallet.Failed,
                content: e.toString(),
            });
        });
    }


    handleSendit() {
        validateFormHashed(this.form).then((values) => {
            this.setState({ modalOpenSend: false });

            if (!this.state.sourceWallet.matches(values.password)) {
                message.error('Wrong password entered.');
                return;
            }

            this.state.sourceWallet.send(
                values.bitcoin, values.address, this.fee, values.password
            ).then(() => {
                message.success(Constants.Messages.Transactions.Sent);
                this.handleReload();
            }, (e) => {

                const info = { title: Constants.Messages.Transactions.NOTSent };
                const substring = Constants.ReturnValues.Fragments.MinimumFeeNotMet;
                if (e.toString().includes(substring)) {
                    info.content = Constants.Messages.Errors.FeeNotMet;
                }
                Modal.error(info);
            });

        }, (e) => {
            console.log(e);
            message.error('Bad format for password entered');
        });
    }

    handleCancel() {
        this.setState({
            modalOpenCreate: false,
            modalOpenSend: false,
        });
        this.form = null;
    }

    handleReload() {
        this.state.wallets.forEach(w => w.update(blockchainApi));
    }

    render() {
        const openSendModal = (event, record) => {
            event.stopPropagation();
            this.setState({
                sourceWallet: record,
                modalOpenSend: true,
            });
        };

        const onDeleteRow = (event, record) => {
            event.stopPropagation();
            this.setState({
                wallets: this.state.wallets.filter(w => w !== record)
            });
            record.erase();
        };

        const onAddressClick = (event, record) => {
            clipboard.writeText(record.address);
            message.success('Address copied to the clipboard');
        };


        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Asset', key: 'asset', render: (r) => {
                    return (
                        <span key={r.asset}
                              tabIndex={0}
                              role="button"
                              style={{ cursor: 'copy' }}>{r.asset}</span>
                    );
                }
            },
            { title: 'Xpub', key: 'xpub', render: (r) => {
                return (
                        <span key={r.xpub}
                              tabIndex={0}
                              role="button"
                              style={{ cursor: 'copy' }}
                              onClick={e => onAddressClick(e, r)}>{r.xpub.substring(0, 20) + "..." + r.xpub.substring(r.xpub.length - 21)}</span>
                    );
                }
            },
            { title: 'Bitcoins', dataIndex: 'coins', key: 'coins' },
            { title: 'Send', key: 'send', render: (r) => {
                return (
                        <Button disabled={this.fees > 0} onClick={e => openSendModal(e, r)} icon="login" />
                    );
                }
            },
            { title: 'Action', key: 'action', render: (r) => {
                return (
                        <Popconfirm title="Sure to delete?"
                                    onConfirm={e => onDeleteRow(e, r)}>
                            <a>Delete</a>
                        </Popconfirm>
                    );
                }
            },
        ];

        return (
            <div className="Wallets">
                <div style={{ marginBottom: '12px' }}>
                    <Button
                      type="primary"
                      icon="plus-circle-o"
                      style={{ marginLeft: '8px' }}
                      onClick={() => this.setState({ modalOpenCreate: true, })}>Create
                    </Button>
                    <Button type="primary"
                            shape="circle"
                            icon="reload"
                            style={{ marginLeft: '8px' }}
                            onClick={this.handleReload} />
                </div>
                <Modal
                  title="Create a New Wallet"
                  visible={this.state.modalOpenCreate}
                  okText="Create"
                  onCancel={this.handleCancel}
                  onOk={this.handleCreate}>
                    <CreateForm
                        ref={form => (this.form = form)}
                        handleCreate={this.handleCreate} />
                </Modal>


                <Table columns={columns}
                       dataSource={this.state.wallets}
                       pagination={false}
                       style={{ height: '250px', backgroundColor: 'white' }} />

                <Modal
                    title="Send Money"
                    visible={this.state.modalOpenSend}
                    okText="Send"
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.sendingPayment}
                    onOk={this.handleSendit}>
                    <CreateTransaction
                        ref={form => (this.form = form)}
                        sender={this.state.sourceWallet}
                        fees={this.fee}
                        rate={1.0 / this.state.price} />
                </Modal>

                <div style={{ marginTop: '24px' }}>
                    <h3>Total: {`${formatAmount(this.state.total * this.state.price)}` }</h3>
                    <span>{`(at ${formatAmount(this.state.price)} per BTC)`}</span>
                </div>
            </div>
        );
    }
}

export default WalletsContent;
