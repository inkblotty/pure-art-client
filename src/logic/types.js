"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var classify = require('bitcoinjs-lib/src/classify.js');
function getFromAddresses(transaction) {
    return mapEither(transaction.tx.ins, function (input) { return getFromAddress(input.script); }, console.warn)
        .map(function (str) { return ({ address: str, asset: transaction.asset }); });
}
var AddressError;
(function (AddressError) {
    AddressError[AddressError["UnsupportedAddressType"] = 0] = "UnsupportedAddressType";
})(AddressError || (AddressError = {}));
console.log(getFromAddress(Buffer.from("47304402203eeb8ea83773d671d7d6044bb6360a6e586d360b9a66df6ff49b4b179f048b3c0220321de3f64b7ae9483943d9117d6adec29f43d489e2c7f6707da4baf3977f8b88012102ac17e27f09a5d6b708b60715e164dab5bdc5a5bd55c2759f00cf489cec946645", 'hex')));
console.log(getToAddress('BTC', Buffer.from("76a914a6f481e7409808bbcd2731c232c276e95808bef588ac", 'hex')));
// { right: '1Q6RQnxKpurMQXF1iQwCnZHCTBEZDhcuCs' }
function getFromAddress(inputScript) {
    switch (classify.input(inputScript)) {
        case "pubkeyhash": {
            return { right: bitcoinjs_lib_1.payments.p2pkh({ input: inputScript }).address };
        }
        default: {
            return { left: AddressError.UnsupportedAddressType };
        }
    }
}
exports.getFromAddress = getFromAddress;
function getToAddresses(transaction) {
    return transaction.tx.outs.map(getToAddresses.apply(transaction.asset));
}
function getToAddress(a, outputScript) {
    return { address: bitcoinjs_lib_1.address.fromOutputScript(outputScript), asset: a };
}
function toPath(dp) {
    return "m/" + dp.join('/');
}
exports.toPath = toPath;
function right(e) {
    return e.right;
}
function left(e) {
    return e.left;
}
function catEithers(es, logger) {
    es.filter(left).map(function (x) { return logger(left(x)); });
    return es.filter(right).map(right);
}
function mapEither(as, f, logger) {
    return catEithers(as.map(f), logger || (function () { }));
}
function catMaybes(mas) {
    return mas.filter(function (v) { return v !== 'Nothing'; });
}
function mapMaybe(as, f) {
    return catMaybes(as.map(f));
}
function fromMaybe(def, m) {
    if (m === 'Nothing') {
        return def;
    }
    else {
        return m;
    }
}
console.log(toPath([0, 1, 2, 3]));
//# sourceMappingURL=types.js.map