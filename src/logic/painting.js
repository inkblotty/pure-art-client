"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var zero = new bignumber_js_1.default(0);
var one = new bignumber_js_1.default(1);
function coordinateInPlane(c, p) {
    var xInRange = zero.isLessThanOrEqualTo(c.x) && c.x.isLessThanOrEqualTo(p.xSize.minus(one));
    var yInRange = zero.isLessThanOrEqualTo(c.y) && c.y.isLessThanOrEqualTo(p.ySize.minus(one));
    return xInRange && yInRange;
}
var BlockchainPainting = /** @class */ (function () {
    function BlockchainPainting(painting, fountAddress, expTx, impTx) {
        this.painting = painting;
        this.fountAddress = fountAddress;
        this.expTx = expTx;
        this.impTx = impTx;
    }
    return BlockchainPainting;
}());
exports.BlockchainPainting = BlockchainPainting;
var Painting = /** @class */ (function () {
    function Painting(plane, edges) {
        if (!edges.every(function (e) { return e.every(function (c) { return coordinateInPlane(c, plane); }); })) {
            throw new Error('Not all edges fit on this plane ' + plane);
        }
        this.plane = plane;
        this.edges = edges;
    }
    Painting.prototype.toRender = function () {
    };
    return Painting;
}());
exports.Painting = Painting;
//# sourceMappingURL=painting.js.map