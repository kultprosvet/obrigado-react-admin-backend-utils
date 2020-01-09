"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_errors_1 = require("apollo-server-errors");
var jwt = require("jsonwebtoken");
var cookie = require("cookie");
'cookie';
exports.getAdministratorData = function (req) {
    try {
        var user = void 0;
        user = null;
        var token = null;
        var cookies = {};
        if ((typeof req.headers.cookie) === 'string') {
            cookies = cookie.parse(req.headers.cookie || '');
        }
        else {
            cookies = req.headers.cookie;
        }
        if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }
        else if (cookies.admin_token) {
            token = cookies.admin_token;
        }
        if (token) {
            var secret = process.env.APP_SECRET;
            if (!secret) {
                throw new apollo_server_errors_1.ApolloError('Secret is not provided, please provide set env `APP_SECRET`');
            }
            if (jwt.verify(token, secret)) {
                var data = jwt.decode(token);
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
