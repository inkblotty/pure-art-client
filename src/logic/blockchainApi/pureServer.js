System.register(["../asset", "bignumber.js"], function (exports_1, context_1) {
    "use strict";
    var asset_1, bignumber_js_1, PureServer;
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
            PureServer = (function () {
                function PureServer(baseUrl) {
                    this.baseUrl = baseUrl;
                }
                PureServer.prototype.getFee = function (t) {
                    return asset_1.mkAtomic(t, new bignumber_js_1["default"](1000));
                };
                PureServer.prototype.broadcast = function (t, tx) {
                    return true;
                };
                PureServer.prototype.getUtxos = function (t, address) {
                    return undefined;
                };
                PureServer.prototype.getTxs = function (t, address) {
                    return undefined;
                };
                return PureServer;
            }());
            exports_1("PureServer", PureServer);
        }
    };
});
//# sourceMappingURL=pureServer.js.map