"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheckerAdmin = function (_a, roles) {
    var root = _a.root, args = _a.args, context = _a.context, info = _a.info;
    if (!roles.includes('admin'))
        return false;
    if (context.administrator)
        return true;
    return false;
};
