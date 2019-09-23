"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAdminResourceResolver_1 = require("../BaseAdminResourceResolver");
const type_graphql_1 = require("type-graphql");
const GQLAdministrator_1 = require("../types/GQLAdministrator");
const GQLAdministratorInput_1 = require("../types/GQLAdministratorInput");
const Administrator_1 = require("../models/Administrator");
const AdminDataBaseResolver = BaseAdminResourceResolver_1.createBaseCrudResolver(GQLAdministrator_1.GQLAdministrator, GQLAdministratorInput_1.GQLAdministratorInput, Administrator_1.Administrator);
let AdminDataResolver = class AdminDataResolver extends AdminDataBaseResolver {
};
AdminDataResolver = __decorate([
    type_graphql_1.Resolver()
], AdminDataResolver);
exports.AdminDataResolver = AdminDataResolver;
//# sourceMappingURL=AdminDataResolver.js.map