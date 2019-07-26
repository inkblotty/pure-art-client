System.register([], function (exports_1, context_1) {
    "use strict";
    var Bitcoin, BitcoinTestnet, Dogecoin, Litecoin;
    var __moduleName = context_1 && context_1.id;
    function getAssetDetails(a) {
        switch (a) {
            case 'BTC': return Bitcoin;
            case 'LTC': return Litecoin;
            case 'DOGE': return Dogecoin;
            case 'BTC-T': return BitcoinTestnet;
        }
    }
    exports_1("getAssetDetails", getAssetDetails);
    function mkAtomic(a, val) {
        return { asset: a, unit: 'Atomic', val: val };
    }
    exports_1("mkAtomic", mkAtomic);
    function mkCanonic(a, val) {
        return { asset: a, unit: 'Canonic', val: val };
    }
    exports_1("mkCanonic", mkCanonic);
    function atomize(a, c) {
        var decimals = a.decimals;
        return mkAtomic(a.asset, c.val.times(decimals));
    }
    exports_1("atomize", atomize);
    function canonicalize(a, c) {
        var decimals = a.decimals;
        return mkCanonic(a.asset, c.val.dividedBy(decimals));
    }
    exports_1("canonicalize", canonicalize);
    return {
        setters: [],
        execute: function () {
            Bitcoin = {
                decimals: 8,
                asset: 'BTC',
                pubKeyHash: 0x00,
                scriptHash: 0x05
            };
            BitcoinTestnet = {
                decimals: 8,
                asset: 'BTC-T',
                pubKeyHash: 0x6f,
                scriptHash: 0xc4
            };
            Dogecoin = {
                decimals: 8,
                asset: 'DOGE',
                pubKeyHash: 0x1E,
                scriptHash: 0x16
            };
            Litecoin = {
                decimals: 8,
                asset: 'LTC',
                pubKeyHash: 0x30,
                scriptHash: 0x32
            };
        }
    };
});
//# sourceMappingURL=asset.js.map