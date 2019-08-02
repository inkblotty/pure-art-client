"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var antd_1 = require("antd");
// @ts-ignore
var electron_1 = require("electron");
var constants_1 = __importDefault(require("./logic/constants"));
var create_form_modal_component_1 = __importDefault(require("./create.form.modal.component"));
var hasher_util_1 = __importDefault(require("./logic/hasher.util"));
var wallet_js_1 = require("./logic/wallet.js");
var blockcypher_1 = require("./logic/blockchainApi/blockcypher");
var asset_1 = require("./logic/asset");
var Wallet_1 = require("./logic/Wallet");
var blockchainApi = blockcypher_1.blockcypher;
// Helper Functions
var validateFormHashed = function (form) {
    return new Promise(function (res, rej) {
        form.validateFields(function (err, values) {
            if (err)
                rej(err);
            hasher_util_1.default.hash(values.password).then(function (hash) {
                values.password = hash;
                res(values);
            }, function (e) {
                rej(e);
            });
        });
    });
};
var formatAmount = function (amount) {
    var nf = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return nf.format(amount.val.toNumber());
};
var WalletsContent = /** @class */ (function (_super) {
    __extends(WalletsContent, _super);
    function WalletsContent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            modalOpenCreate: false,
            modalOpenSend: false,
            price: 1.0,
            total: 0.0,
            wallets: [],
            sendingPayment: false,
            sourceWallet: null,
        };
        _this.handleCreate = _this.handleCreate.bind(_this);
        _this.handleSendit = _this.handleSendit.bind(_this);
        _this.handleCancel = _this.handleCancel.bind(_this);
        _this.handleReload = _this.handleReload.bind(_this);
        return _this;
    }
    WalletsContent.prototype.getFee = function (a) {
        return this.fees[a];
    };
    WalletsContent.prototype.componentDidMount = function () {
        var _this = this;
        blockchainApi.getPrice('BTC').then(function (r) {
            _this.setState({ price: r.val.toNumber() });
        }).catch(function (e) {
            console.log(e);
        });
        blockchainApi.getFee('BTC').then(function (fee) {
            _this.fees.BTC = fee;
        }).catch(function (e) {
            console.log('Could not get BTC fee ', e);
        });
        blockchainApi.getFee('LTC').then(function (fee) {
            _this.fees.LTC = fee;
        }).catch(function (e) {
            console.log('Could not get LTC fee ', e);
        });
        blockchainApi.getFee('DOGE').then(function (fee) {
            _this.fees.DOGE = fee;
        }).catch(function (e) {
            console.log('Could not get DOGE fee ', e);
        });
        wallet_js_1.Wallet2.all().then(function (wallets) {
            wallets.map(function (w) { return w.update(blockchainApi); });
            _this.setState({ wallets: wallets });
        }, function (e) {
            console.log(e);
            antd_1.message.error('Could not load wallets from database');
        });
    };
    WalletsContent.prototype.handleCreate = function () {
        var _this = this;
        validateFormHashed(this.form).then(function (values) {
            _this.form.resetFields();
            _this.setState({ modalOpenCreate: false });
            var mnemonic = wallet_js_1.Wallet2.generate();
            debugger;
            var wallet = wallet_js_1.Wallet2.create(values.asset.toUpperCase(), values.name, mnemonic, values.password);
            _this.__addWallet(wallet, mnemonic);
        });
    };
    WalletsContent.prototype.__addWallet = function (wallet, mnemonic) {
        this.setState({
            wallets: this.state.wallets.concat([wallet]),
        });
        wallet.save().then(function () {
            antd_1.message.success(constants_1.default.Messages.Wallet.Created);
            setTimeout(function () {
                antd_1.Modal.warning({
                    title: constants_1.default.Messages.Wallet.Mnemonic,
                    content: mnemonic,
                });
            }, 1000);
        }, function (e) {
            antd_1.Modal.error({
                title: constants_1.default.Messages.Wallet.Failed,
                content: e.toString(),
            });
        });
    };
    WalletsContent.prototype.handleSendit = function () {
        var _this = this;
        validateFormHashed(this.form).then(function (values) {
            _this.setState({ modalOpenSend: false });
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
        }, function (e) {
            console.log(e);
            antd_1.message.error('Bad format for password entered');
        });
    };
    WalletsContent.prototype.handleCancel = function () {
        this.setState({
            modalOpenCreate: false,
            modalOpenSend: false,
        });
        this.form = null;
    };
    WalletsContent.prototype.handleReload = function () {
        this.state.wallets.forEach(function (w) { return w.update(blockchainApi); });
    };
    WalletsContent.prototype.render = function () {
        var _this = this;
        var openSendModal = function (event, record) {
            event.stopPropagation();
            _this.setState({
                sourceWallet: record,
                modalOpenSend: true,
            });
        };
        var onDeleteRow = function (event, record) {
            event.stopPropagation();
            _this.setState({
                wallets: _this.state.wallets.filter(function (w) { return w !== record; })
            });
            record.erase();
        };
        var onAddressClick = function (event, record) {
            electron_1.clipboard.writeText(record.fountAddress.address);
            antd_1.message.success('Address copied to the clipboard');
        };
        var columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Asset', key: 'asset', render: function (r) {
                    return (react_1.default.createElement("span", { key: r.asset, tabIndex: 0 }, r.asset));
                }
            },
            { title: 'Fount Address', key: 'fount', render: function (r) {
                    return (react_1.default.createElement("span", { key: r.fountAddress.address, tabIndex: 0, role: "button", style: { cursor: 'copy' }, onClick: function (e) { return onAddressClick(e, r); } }, r.fountAddress.address));
                }
            },
            { title: 'Ink', key: 'coins', render: function (r) {
                    return (react_1.default.createElement("span", { key: 'price', tabIndex: 0 }, asset_1.showCV(r.getBalance())));
                } },
            // { title: 'Send', key: 'send', render: (r) => {
            //     return (
            //             <Button disabled={this.fee.val.isGreaterThan(0)} onClick={e => openSendModal(e, r)} icon="login" />
            //         );
            //     }
            // },
            { title: 'Action', key: 'action', render: function (r) {
                    return (react_1.default.createElement(antd_1.Popconfirm, { title: "Sure to delete?", onConfirm: function (e) { return onDeleteRow(e, r); } },
                        react_1.default.createElement("a", null, "Delete")));
                }
            },
        ];
        return (react_1.default.createElement("div", { className: "Wallets" },
            react_1.default.createElement("div", { style: { marginBottom: '12px' } },
                react_1.default.createElement(antd_1.Button, { type: "primary", icon: "plus-circle-o", style: { marginLeft: '8px' }, onClick: function () { return _this.setState({ modalOpenCreate: true, }); } }, "Create"),
                react_1.default.createElement(antd_1.Button, { type: "primary", shape: "circle", icon: "reload", style: { marginLeft: '8px' }, onClick: this.handleReload })),
            react_1.default.createElement(antd_1.Modal, { title: "Create a New Wallet", visible: this.state.modalOpenCreate, okText: "Create", onCancel: this.handleCancel, onOk: this.handleCreate },
                react_1.default.createElement(create_form_modal_component_1.default, { ref: function (form) { return (_this.form = form); }, handleCreate: this.handleCreate })),
            react_1.default.createElement(antd_1.Table, { columns: columns, dataSource: this.state.wallets, pagination: false, style: { height: '250px', backgroundColor: 'white' }, expandedRowRender: function (wallet) { return react_1.default.createElement("p", { style: { margin: 0 } }, Wallet_1.showXpub(wallet.getXpub())); } }),
            react_1.default.createElement("div", { style: { marginTop: '24px' } },
                react_1.default.createElement("h3", null,
                    "Total: ", "" + formatAmount(this.state.total * this.state.price)),
                react_1.default.createElement("span", null, "(at " + formatAmount(this.state.price) + " per BTC)"))));
    };
    return WalletsContent;
}(react_1.default.Component));
exports.default = WalletsContent;
//# sourceMappingURL=wallets.content.component.js.map