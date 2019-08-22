"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = ({ root, args, context, info }, roles) => {
    if (roles.includes('admin'))
        return false;
    if (!context.administrator)
        return false;
    return true;
};
//# sourceMappingURL=AuthChecker.js.map