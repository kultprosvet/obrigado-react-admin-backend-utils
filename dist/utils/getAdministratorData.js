"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_errors_1 = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
'cookie';
exports.getAdministratorData = (req) => {
    try {
        let user;
        user = null;
        let token = null;
        const cookies = cookie.parse(req.headers.cookie || '');
        if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }
        else if (cookies.admin_token) {
            token = cookies.admin_token;
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