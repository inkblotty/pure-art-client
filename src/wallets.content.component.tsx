import React from 'react';
import { Button, message, Modal, Popconfirm, Table } from 'antd';
// @ts-ignore
import { clipboard } from 'electron';
import Constants from './logic/constants';
import CreateForm from './create.form.modal.component';
import Hasher from './logic/hasher.util';
import { Wallet2 } from './logic/wallet.js';
import { blockcypher } from './logic/blockchainApi/blockcypher';
import { Asset, Atomic, Canonic, showCV } from './logic/asset';
import { showXpub } from './logic/Wallet';

const blockchainApi = blockcypher
// Helper Functions

const validateFormHashed: (f: any) => any = (form) => {
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

const formatAmount = (amount: Canonic<'USD'>) => {
    const nf = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return nf.format(amount.val.toNumber());
};

class WalletsContent extends React.Component<any, WalletsContentState> {
    private fees: { [ A in Asset ]: Atomic<A> }

    private form: any
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

    getFee<A extends Asset> (a: A): Atomic<A> {
        return this.fees[a] as Atomic<A>
    }

    componentDidMount() {
        blockchainApi.getPrice('BTC').then((r) => {
            this.setState({ price: r.val.toNumber() });
        }).catch((e) => {
            console.log(e);
        });

        blockchainApi.getFee('BTC').then((fee) => {
            this.fees.BTC = fee;
        }).catch((e) => {
            console.log('Could not get BTC fee ', e);
        });
        blockchainApi.getFee('LTC').then((fee) => {
            this.fees.LTC = fee;
        }).catch((e) => {
            console.log('Could not get LTC fee ', e);
        });
        blockchainApi.getFee('DOGE').then((fee) => {
            this.fees.DOGE = fee;
        }).catch((e) => {
            console.log('Could not get DOGE fee ', e);
        });


        Wallet2.all().then((wallets) => {
            wallets.map((w) => w.update(blockchainApi));
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

            // if (!this.state.sourceWallet.matches(values.password)) {
            //     message.error('Wrong password entered.');
            //     return;
            // }
            //
            // this.state.sourceWallet.send(
            //     values.bitcoin, values.address, this.fee, values.password
            // ).then(() => {
            //     message.success(Constants.Messages.Transactions.Sent);
            //     this.handleReload();
            // }, (e) => {
            //     const info = { title: Constants.Messages.Transactions.NOTSent } as any;
            //     const substring = Constants.ReturnValues.Fragments.MinimumFeeNotMet;
            //     if (e.toString().includes(substring)) {
            //         info.content = Constants.Messages.Errors.FeeNotMet;
            //     }
            //     Modal.error(info);
            // });

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
            clipboard.writeText(record.fountAddress.address);
            message.success('Address copied to the clipboard');
        };

        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Asset', key: 'asset', render: (r) => {
                    return (
                        <span key={r.asset}
                              tabIndex={0}
                              >{r.asset}</span>
                    );
                }
            },
            { title: 'Fount Address', key: 'fount', render: (r) => {
                return (
                        <span key={r.fountAddress.address}
                              tabIndex={0}
                              role="button"
                              style={{ cursor: 'copy' }}
                              onClick={e => onAddressClick(e, r)}>{r.fountAddress.address}</span>
                    );
                }
            },
            { title: 'Ink', key: 'coins', render: (r) => {
              return (
                  <span key={'price'}
                        tabIndex={0}
                  >{showCV(r.getBalance())}</span>
              )
            } },
            // { title: 'Send', key: 'send', render: (r) => {
            //     return (
            //             <Button disabled={this.fee.val.isGreaterThan(0)} onClick={e => openSendModal(e, r)} icon="login" />
            //         );
            //     }
            // },
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
                       style={{ height: '250px', backgroundColor: 'white' }}
                       expandedRowRender={wallet => <p style={{ margin: 0 }}>{showXpub(wallet.getXpub())}</p>}
                />

                {/*<Modal*/}
                {/*    title="Send Money"*/}
                {/*    visible={this.state.modalOpenSend}*/}
                {/*    okText="Send"*/}
                {/*    onCancel={this.handleCancel}*/}
                {/*    confirmLoading={this.state.sendingPayment}*/}
                {/*    onOk={this.handleSendit}>*/}
                {/*    <CreateTransaction*/}
                {/*        ref={form => (this.form = form)}*/}
                {/*        sender={this.state.sourceWallet}*/}
                {/*        fees={this.fee}*/}
                {/*        rate={1.0 / this.state.price} />*/}
                {/*</Modal>*/}

                <div style={{ marginTop: '24px' }}>
                    <h3>Total: {`${formatAmount(this.state.total * this.state.price)}` }</h3>
                    <span>{`(at ${formatAmount(this.state.price)} per BTC)`}</span>
                </div>
            </div>
        );
    }
}

type WalletsContentState = {
    modalOpenCreate: boolean,
    modalOpenSend: boolean,
    price: number,
    total: number,
    wallets: Wallet2<Asset>[],
    sendingPayment: boolean,
    sourceWallet: Wallet2<Asset>,
}

export default WalletsContent;
