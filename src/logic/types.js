"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toPath(dp) {
    return "m/" + dp.join('/');
}
exports.toPath = toPath;
console.log(toPath([0, 1, 2, 3]));
//# sourceMappingURL=types.js.map