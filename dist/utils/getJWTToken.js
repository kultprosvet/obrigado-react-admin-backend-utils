"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_errors_1 = require("apollo-server-errors");
const jwt = require("jsonwebtoken");
function getJWTToken(data, expireDays = 360) {
    const secret = process.env.APP_SECRET;
    if (!secret) {
        throw new apollo_server_errors_1.ApolloError('Secret not provided, please provide set env `APP_SECRET`');
    }
    return jwt.sign({
        data,
    }, secret, {
        expiresIn: `${expireDays} days`,
    });
}
exports.getJWTToken = getJWTToken;
//# sourceMappingURL=getJWTToken.js.map