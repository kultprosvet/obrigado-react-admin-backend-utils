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
const BaseAdminResourceResolver_1 = require("../BaseAdminResourceResolver");
const type_graphql_1 = require("type-graphql");
const GQLAdministrator_1 = require("../types/GQLAdministrator");
const GQLAdministratorInput_1 = require("../types/GQLAdministratorInput");
const Administrator_1 = require("../models/Administrator");
const apollo_server_errors_1 = require("apollo-server-errors");
const EntityUpdateHelper_1 = require("../EntityUpdateHelper");
const bcrypt = require("bcrypt");
const AdminDataBaseResolver = BaseAdminResourceResolver_1.createBaseCrudResolver(GQLAdministrator_1.GQLAdministrator, GQLAdministratorInput_1.GQLAdministratorInput, Administrator_1.Administrator);
let AdminDataResolver = class AdminDataResolver extends AdminDataBaseResolver {
    async update(id, data) {
        // @ts-ignore
        let entity = await Administrator_1.Administrator.findOne({ where: { id } });
        if (!entity)
            throw new apollo_server_errors_1.ApolloError('Entity not found for id ' + id, 'NOT_FOUND');
        await EntityUpdateHelper_1.EntityUpdateHelper.update(entity, data, { ignore: ['password'] });
        if (data.password)
            entity.password = bcrypt.hashSync(data.password, 10);
        await entity.save();
        return entity;
    }
    async create(data) {
        // @ts-ignore
        let entity = new Administrator_1.Administrator();
        await EntityUpdateHelper_1.EntityUpdateHelper.update(entity, data, { ignore: ['password'] });
        if (data.password)
            entity.password = bcrypt.hashSync(data.password, 10);
        await entity.save();
        return entity;
    }
};
__decorate([
    type_graphql_1.Authorized('admin'),
    type_graphql_1.Mutation(type => GQLAdministrator_1.GQLAdministrator, { name: `adminAdministratorUpdate` }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('data', type => GQLAdministratorInput_1.GQLAdministratorInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, GQLAdministratorInput_1.GQLAdministratorInput]),
    __metadata("design:returntype", Promise)
], AdminDataResolver.prototype, "update", null);
__decorate([
    type_graphql_1.Authorized('admin'),
    type_graphql_1.Mutation(type => GQLAdministrator_1.GQLAdministrator, { name: `adminAdministratorCreate` }),
    __param(0, type_graphql_1.Arg('data', type => GQLAdministratorInput_1.GQLAdministratorInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GQLAdministratorInput_1.GQLAdministratorInput]),
    __metadata("design:returntype", Promise)
], AdminDataResolver.prototype, "create", null);
AdminDataResolver = __decorate([
    type_graphql_1.Resolver()
], AdminDataResolver);
exports.AdminDataResolver = AdminDataResolver;
//# sourceMappingURL=AdminDataResolver.js.map