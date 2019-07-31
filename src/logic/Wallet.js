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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var asset_1 = require("./asset");
var bip39 = __importStar(require("bip39"));
var crypto = __importStar(require("crypto"));
var database_1 = __importDefault(require("./database"));
var bitcoin = require('bitcoinjs-lib');
var DefaultEncryptionScheme = 'aes-256-cbc';
var DefaultDBFileName = 'wallets';
var Wallet2 = /** @class */ (function (_super) {
    __extends(Wallet2, _super);
    function Wallet2(info) {
        var _this = _super.call(this) || this;
        _this.name = info.name;
        _this.asset = info.asset;
        _this.fountAddress = info.fountAddress;
        _this.wif = info.wif;
        _this.xpub = info.xpub;
        _this.assetDetails = asset_1.mkAssetDetails(info.asset);
        _this.passwordHash = info.passwordHash; // TODO: hash this. duh.
        _this.utxos = [];
        return _this;
    }
    Wallet2.prototype.getUtxos = function () { return this.utxos; };
    Wallet2.prototype.getBalance = function () {
        var atomicBalance = this.utxos.reduce(function (a, c) { return asset_1.cPlus('Atomic', a, c.value); }, asset_1.mkAtomic(this.asset, new bignumber_js_1.default(0)));
        return asset_1.canonicalize(this.assetDetails, atomicBalance);
    };
    Wallet2.prototype.getName = function () { return this.name; };
    Wallet2.prototype.getFountAddress = function () { return this.fountAddress; };
    Wallet2.prototype.getWif = function () {
        return this.wif;
    };
    Wallet2.prototype.getXpub = function () {
        return this.xpub;
    };
    Wallet2.create = function (asset, name, mnemonic, password) {
        var seed = bip39.mnemonicToSeed(mnemonic);
        var details = asset_1.mkAssetDetails(asset);
        var master = bitcoin.HDNode.fromSeedBuffer(seed, details.bitcoinjsNetwork);
        var xpub = master.neutered().toBase58();
        var derived = master.derivePath("44'/0'/" + details.bip44 + "'");
        var addressDerived = derived.getAddress();
        var fountAddress = { address: addressDerived, asset: asset };
        var encryptedWif = Wallet2.encryptWif(derived.keyPair.toWIF(), password);
        return new Wallet2({
            name: name,
            fountAddress: fountAddress,
            wif: encryptedWif,
            asset: asset,
            xpub: xpub,
            passwordHash: password // TODO: hash this boi
        });
    };
    Wallet2.generate = function () {
        return bip39.generateMnemonic();
    };
    Wallet2.encryptWif = function (wif, password) {
        var cipher = crypto.createCipher(DefaultEncryptionScheme, password);
        return cipher.update(wif, 'utf8', 'hex') + cipher.final('hex');
    };
    Wallet2.decryptWif = function (encryptedWif, password) {
        var cipher = crypto.createDecipher(DefaultEncryptionScheme, password);
        return cipher.update(encryptedWif, 'hex', 'utf8') + cipher.final('utf8');
    };
    Object.defineProperty(Wallet2, "store", {
        get: function () {
            return Wallet2.dbStore;
        },
        enumerable: true,
        configurable: true
    });
    Wallet2.all = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Wallet2.store.find({ asset: a }).then(function (docs) {
                        return docs.map(function (doc) { return new Wallet2(doc); });
                    })];
            });
        });
    };
    Wallet2.prototype.update = function (bapi) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, bapi.getUnspentOutputs(this.asset, this.fountAddress).then(function (result) {
                        _this.utxos = result;
                        _this.emit('updated');
                    }, function (e) {
                        _this.emit('error on utxo acquisition: ' + e.toString());
                    })];
            });
        });
    };
    Wallet2.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Wallet2.store.insert(this.toObject())];
            });
        });
    };
    Wallet2.prototype.erase = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Wallet2.store.remove({ xpub: this.xpub });
                this.emit('deleted');
                return [2 /*return*/];
            });
        });
    };
    Wallet2.prototype.toObject = function () {
        return {
            name: this.name,
            fountAddress: this.fountAddress,
            wif: this.wif,
            xpub: this.xpub,
            asset: this.asset,
            passwordHash: this.passwordHash
        };
    };
    Wallet2.dbStore = database_1.default;
    return Wallet2;
}(events_1.default));
exports.Wallet2 = Wallet2;
var WalletUpdated = 'updated';
var WalletDeleted = 'deleted';
//# sourceMappingURL=Wallet.js.map