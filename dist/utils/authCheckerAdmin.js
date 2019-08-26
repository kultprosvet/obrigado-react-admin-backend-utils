"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheckerAdmin = ({ root, args, context, info }, roles) => {
    if (!roles.includes('admin'))
        return false;
    if (context.administrator)
        return true;
    return false;
};
//# sourceMappingURL=authCheckerAdmin.js.map