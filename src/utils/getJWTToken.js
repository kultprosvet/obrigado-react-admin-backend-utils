"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_errors_1 = require("apollo-server-errors");
var jwt = require("jsonwebtoken");
function getJWTToken(data, expireDays) {
    if (expireDays === void 0) { expireDays = 360; }
    var secret = process.env.APP_SECRET;
    if (!secret) {
        throw new apollo_server_errors_1.ApolloError('Secret not provided, please provide set env `APP_SECRET`');
    }
    return jwt.sign({
        data: data,
    }, secret, {
        expiresIn: expireDays + " days",
    });
}
exports.getJWTToken = getJWTToken;
