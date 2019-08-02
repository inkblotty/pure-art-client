"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coininfo = require('coininfo');
exports.assets = ['BTC', 'BTC-T', 'DOGE', 'LTC'];
var Bitcoin = {
    decimals: 8,
    asset: 'BTC',
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    bip44: 0,
    bitcoinjsNetwork: coininfo.bitcoin.main.toBitcoinJS()
};
var BitcoinTestnet = {
    decimals: 8,
    asset: 'BTC-T',
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    bip44: 0,
    bitcoinjsNetwork: coininfo.bitcoin.test.toBitcoinJS()
};
var Dogecoin = {
    decimals: 8,
    asset: 'DOGE',
    pubKeyHash: 0x1E,
    scriptHash: 0x16,
    bip44: 30,
    bitcoinjsNetwork: coininfo.dogecoin.main.toBitcoinJS()
};
var Litecoin = {
    decimals: 8,
    asset: 'LTC',
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    bip44: 5,
    bitcoinjsNetwork: coininfo.litecoin.main.toBitcoinJS()
};
function mkAssetDetails(a) {
    return getAssetDetails(a);
}
exports.mkAssetDetails = mkAssetDetails;
function getAssetDetails(a) {
    switch (a) {
        case 'BTC': return Bitcoin;
        case 'LTC': return Litecoin;
        case 'DOGE': return Dogecoin;
        case 'BTC-T': return BitcoinTestnet;
    }
}
exports.getAssetDetails = getAssetDetails;
function cPlus(u, c1, c2) {
    return Object.assign(c1, { val: c1.val.plus(c2.val), unit: u });
}
exports.cPlus = cPlus;
function mkAtomic(a, val) {
    return { asset: a, unit: 'Atomic', val: val };
}
exports.mkAtomic = mkAtomic;
function mkCanonic(a, val) {
    return { asset: a, unit: 'Canonic', val: val };
}
exports.mkCanonic = mkCanonic;
function atomize(a, c) {
    var decimals = a.decimals;
    return mkAtomic(a.asset, c.val.times(decimals));
}
exports.atomize = atomize;
function canonicalize(a, c) {
    var decimals = a.decimals;
    return mkCanonic(a.asset, c.val.dividedBy(decimals));
}
exports.canonicalize = canonicalize;
function showCV(cv) {
    switch (cv.unit) {
        case 'Atomic': return showCV(canonicalize(mkAssetDetails(cv.asset), cv));
        case 'Canonic': return cv.val.toString() + "  " + cv.asset.toLowerCase();
    }
}
exports.showCV = showCV;
// const bitcoinjs = require( 'bitcoinjs-lib' );
//
// const pubkey = Buffer.from( '0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352', 'hex' );
// const { address } = bitcoinjs.payments.p2pkh({ pubkey });
// console.log( address );
//# sourceMappingURL=asset.js.map