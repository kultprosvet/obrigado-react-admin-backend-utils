"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_graphql_1 = require("type-graphql");
var GQLFileInput = /** @class */ (function () {
    function GQLFileInput() {
    }
    __decorate([
        type_graphql_1.Field({ nullable: true, description: "name of the file, set null if you want to delete current file" })
    ], GQLFileInput.prototype, "file_name", void 0);
    __decorate([
        type_graphql_1.Field({ description: "File body in base64 encoding,set null if you want to delete current file", nullable: true })
    ], GQLFileInput.prototype, "body", void 0);
    __decorate([
        type_graphql_1.Field({ defaultValue: false, description: "Set this to true if you want to leave current file unchanged" })
    ], GQLFileInput.prototype, "skip", void 0);
    GQLFileInput = __decorate([
        type_graphql_1.InputType('FileInput')
    ], GQLFileInput);
    return GQLFileInput;
}());
exports.GQLFileInput = GQLFileInput;
