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
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const GQLReactAdminPagination_1 = require("./GQLReactAdminPagination");
const GQLReactAdminSort_1 = require("./GQLReactAdminSort");
const GQLReactAdminFilterParam_1 = require("./GQLReactAdminFilterParam");
let GQLReactAdminGetManyReferenceParams = class GQLReactAdminGetManyReferenceParams {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], GQLReactAdminGetManyReferenceParams.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GQLReactAdminGetManyReferenceParams.prototype, "target", void 0);
__decorate([
    type_graphql_1.Field(type => GQLReactAdminPagination_1.GQLReactAdminPagination),
    __metadata("design:type", GQLReactAdminPagination_1.GQLReactAdminPagination)
], GQLReactAdminGetManyReferenceParams.prototype, "pagination", void 0);
__decorate([
    type_graphql_1.Field(type => GQLReactAdminSort_1.GQLReactAdminSort),
    __metadata("design:type", GQLReactAdminSort_1.GQLReactAdminSort)
], GQLReactAdminGetManyReferenceParams.prototype, "sort", void 0);
__decorate([
    type_graphql_1.Field(type => [GQLReactAdminFilterParam_1.GQLReactAdminFilterParam], { nullable: true }),
    __metadata("design:type", GQLReactAdminFilterParam_1.GQLReactAdminFilterParam)
], GQLReactAdminGetManyReferenceParams.prototype, "filter", void 0);
GQLReactAdminGetManyReferenceParams = __decorate([
    type_graphql_1.InputType('ReactAdminGetManyReferenceParams')
], GQLReactAdminGetManyReferenceParams);
exports.GQLReactAdminGetManyReferenceParams = GQLReactAdminGetManyReferenceParams;
//# sourceMappingURL=GQLReactAdminGetManyReferenceParams.js.map