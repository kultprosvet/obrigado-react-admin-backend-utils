"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_graphql_1 = require("type-graphql");
var GQLAdministrator = /** @class */ (function () {
    function GQLAdministrator() {
    }
    __decorate([
        type_graphql_1.Field(function (type) { return type_graphql_1.Int; })
    ], GQLAdministrator.prototype, "id", void 0);
    __decorate([
        type_graphql_1.Field()
    ], GQLAdministrator.prototype, "username", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true })
    ], GQLAdministrator.prototype, "last_name", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true })
    ], GQLAdministrator.prototype, "first_name", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true })
    ], GQLAdministrator.prototype, "token", void 0);
    GQLAdministrator = __decorate([
        type_graphql_1.ObjectType('Administrator')
    ], GQLAdministrator);
    return GQLAdministrator;
}());
exports.GQLAdministrator = GQLAdministrator;
