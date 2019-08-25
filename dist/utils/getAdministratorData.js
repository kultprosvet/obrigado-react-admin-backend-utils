"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_errors_1 = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
exports.getAdministratorData = (req) => {
    try {
        let user;
        user = null;
        let token = null;
        if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }
        else if (req.cookies.admin_token) {
            token = req.cookies.admin_token;
        }
        if (token) {
            const secret = process.env.APP_SECRET;
            if (!secret) {
                throw new apollo_server_errors_1.ApolloError('Secret is not provided, please provide set env `APP_SECRET`');
            }
            if (jwt.verify(token, secret)) {
                const data = jwt.decode(token);
                user = data.data;
                if (user.type !== 'admin') {
                    user = null;
                }
            }
        }
        return { administrator: user };
    }
    catch (e) {
        console.log('admin auth error', e);
        return { administrator: null };
    }
};
//# sourceMappingURL=getAdministratorData.js.map