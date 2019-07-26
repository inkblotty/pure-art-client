System.register(["../asset", "bignumber.js"], function (exports_1, context_1) {
    "use strict";
    var asset_1, bignumber_js_1, Blockcypher;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (asset_1_1) {
                asset_1 = asset_1_1;
            },
            function (bignumber_js_1_1) {
                bignumber_js_1 = bignumber_js_1_1;
            }
        ],
        execute: function () {
            Blockcypher = (function () {
                function Blockcypher(baseUrl) {
                    this.baseUrl = baseUrl;
                }
                Blockcypher.prototype.getFee = function (t) {
                    return asset_1.mkAtomic(t, new bignumber_js_1["default"](1000));
                };
                Blockcypher.prototype.broadcast = function (t, tx) {
                    return true;
                };
                Blockcypher.prototype.getUtxos = function (t, address) {
                    return undefined;
                };
                Blockcypher.prototype.getTxs = function (t, address) {
                    return undefined;
                };
                return Blockcypher;
            }());
            exports_1("Blockcypher", Blockcypher);
        }
    };
});
//# sourceMappingURL=blockcypher.js.map