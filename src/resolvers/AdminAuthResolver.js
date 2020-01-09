"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_graphql_1 = require("type-graphql");
var GQLAdministrator_1 = require("../types/GQLAdministrator");
var Administrator_1 = require("../models/Administrator");
var apollo_server_errors_1 = require("apollo-server-errors");
var __1 = require("..");
var bcrypt = require("bcrypt");
var GQLLogoutResult_1 = require("../types/GQLLogoutResult");
var moment = require("moment");
var AdminAuthResolver = /** @class */ (function () {
    function AdminAuthResolver() {
    }
    AdminAuthResolver.prototype.adminLogin = function (username, password, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var user, secret, expire;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Administrator_1.Administrator.findOne({ where: { username: username } })];
                    case 1:
                        user = _a.sent();
                        if (user == null) {
                            throw new apollo_server_errors_1.ApolloError('Wrong email or password', 'WRONG_CREDENTIALS');
                        }
                        if (!bcrypt.compareSync(password, user.password)) {
                            throw new apollo_server_errors_1.ApolloError('Wrong email or password', 'WRONG_CREDENTIALS');
                        }
                        secret = process.env['APP_SECRET'];
                        if (!secret) {
                            throw new apollo_server_errors_1.ApolloError('Please set env APP_SECRET');
                        }
                        expire = parseInt(process.env.ADMINISTRATOR_SESSION_EXPIRE || '365');
                        user.token = __1.getJWTToken({ id: user.id, type: 'admin' }, expire);
                        ctx.session.res.cookie('admin_token', user.token, {
                            httpOnly: true,
                            expires: moment()
                                .add(expire, 'day')
                                .toDate(),
                        });
                        return [2 /*return*/, user];
                }
            });
        });
    };
    AdminAuthResolver.prototype.adminCheck = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!context.administrator)
                    throw new apollo_server_errors_1.ApolloError('Admin not authorized');
                return [2 /*return*/, context.administrator];
            });
        });
    };
    AdminAuthResolver.prototype.adminLogOut = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                ctx.session.res.clearCookie('admin_token');
                return [2 /*return*/, {
                        message: 'Logout success',
                        code: 'SUCCESS',
                    }];
            });
        });
    };
    __decorate([
        type_graphql_1.Mutation(function (type) { return GQLAdministrator_1.GQLAdministrator; }),
        __param(0, type_graphql_1.Arg('username')), __param(1, type_graphql_1.Arg('password')), __param(2, type_graphql_1.Ctx())
    ], AdminAuthResolver.prototype, "adminLogin", null);
    __decorate([
        type_graphql_1.Query(function (type) { return GQLAdministrator_1.GQLAdministrator; }),
        __param(0, type_graphql_1.Ctx())
    ], AdminAuthResolver.prototype, "adminCheck", null);
    __decorate([
        type_graphql_1.Mutation(function (type) { return GQLLogoutResult_1.GQLLogoutResult; }),
        __param(0, type_graphql_1.Ctx())
    ], AdminAuthResolver.prototype, "adminLogOut", null);
    return AdminAuthResolver;
}());
exports.AdminAuthResolver = AdminAuthResolver;
