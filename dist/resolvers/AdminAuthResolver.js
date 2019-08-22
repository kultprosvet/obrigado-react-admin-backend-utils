"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const GQLAdministrator_1 = require("../types/GQLAdministrator");
const Administrator_1 = require("../models/Administrator");
const apollo_server_errors_1 = require("apollo-server-errors");
const getJWTToken_1 = require("../utils/getJWTToken");
const bcrypt_1 = require("bcrypt");
class AdminAuthResolver {
    async adminLogin(username, password) {
        const user = await Administrator_1.Administrator.findOne({ where: { username } });
        if (user == null) {
            throw new apollo_server_errors_1.ApolloError('Wrong email or password', 'WRONG_CREDENTIALS');
        }
        if (!bcrypt_1.default.compareSync(password, user.password)) {
            throw new apollo_server_errors_1.ApolloError('Wrong email or password', 'WRONG_CREDENTIALS');
        }
        let secret = process.env['APP_SECRET'];
        if (!secret) {
            throw new apollo_server_errors_1.ApolloError('Please set env APP_SECRET');
        }
        let expire = parseInt(process.env.ADMINISTRATOR_SESSION_EXPIRE || '365');
        user.token = getJWTToken_1.getJWTToken({ id: user.id, type: 'admin' }, expire);
        return user;
    }
}
__decorate([
    type_graphql_1.Mutation(type => GQLAdministrator_1.GQLAdministrator),
    __param(0, type_graphql_1.Arg('username')), __param(1, type_graphql_1.Arg('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminAuthResolver.prototype, "adminLogin", null);
exports.AdminAuthResolver = AdminAuthResolver;
//# sourceMappingURL=AdminAuthResolver.js.map