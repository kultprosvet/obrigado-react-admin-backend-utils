"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_errors_1 = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
exports.getAdministratorData = (req) => {
    try {
        const authorization = req.headers.authorization;
        let user;
        user = null;
        if (authorization) {
            const token = authorization.replace('Bearer ', '');
            const secret = process.env.APP_SECRET;
            if (!secret) {
                throw new apollo_server_errors_1.ApolloError('Secret is not provided, please provide set env `APP_SECRET`');
            }
            if (jwt.verify(token, secret)) {
                const data = jwt.decode(token);
                user = data.data;
            }
        }
        return { administrator: user };
    }
    catch (e) {
        return null;
    }
};
//# sourceMappingURL=getAdministratorData.js.map