"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roles = [{ name: 'admin', permissions: ['block administrators'] }];
exports.RoleConfig = {
    init(r) {
        for (const item of r) {
            if (item.name === 'admin') {
                roles[0].permissions = roles[0].permissions.concat(item.permissions);
                continue;
            }
            roles.push(item);
        }
    },
    getPermissions(role) {
        if (!role) {
            return roles[0].permissions;
        }
        for (const item of roles) {
            if (item.name === role) {
                return item.permissions;
            }
        }
        return [];
    },
    getRole(role) {
        if (!role) {
            return roles[0].name;
        }
        for (const item of roles) {
            if (item.name === role) {
                return item.name;
            }
        }
        return [];
    },
    getRolesList() {
        let rolesList = [];
        for (const item of roles) {
            rolesList.push(item.name);
        }
        return rolesList;
    }
};
//# sourceMappingURL=RoleConfig.js.map