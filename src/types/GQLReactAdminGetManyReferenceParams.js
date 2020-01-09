"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_graphql_1 = require("type-graphql");
var GQLReactAdminPagination_1 = require("./GQLReactAdminPagination");
var GQLReactAdminSort_1 = require("./GQLReactAdminSort");
var GQLReactAdminFilterParam_1 = require("./GQLReactAdminFilterParam");
var GQLReactAdminGetManyReferenceParams = /** @class */ (function () {
    function GQLReactAdminGetManyReferenceParams() {
    }
    __decorate([
        type_graphql_1.Field()
    ], GQLReactAdminGetManyReferenceParams.prototype, "id", void 0);
    __decorate([
        type_graphql_1.Field()
    ], GQLReactAdminGetManyReferenceParams.prototype, "target", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return GQLReactAdminPagination_1.GQLReactAdminPagination; })
    ], GQLReactAdminGetManyReferenceParams.prototype, "pagination", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return GQLReactAdminSort_1.GQLReactAdminSort; })
    ], GQLReactAdminGetManyReferenceParams.prototype, "sort", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return [GQLReactAdminFilterParam_1.GQLReactAdminFilterParam]; }, { nullable: true })
    ], GQLReactAdminGetManyReferenceParams.prototype, "filter", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true, deprecationReason: "This parameter is present for compatibility with react admin v2 " })
    ], GQLReactAdminGetManyReferenceParams.prototype, "source", void 0);
    GQLReactAdminGetManyReferenceParams = __decorate([
        type_graphql_1.InputType('ReactAdminGetManyReferenceParams')
    ], GQLReactAdminGetManyReferenceParams);
    return GQLReactAdminGetManyReferenceParams;
}());
exports.GQLReactAdminGetManyReferenceParams = GQLReactAdminGetManyReferenceParams;
