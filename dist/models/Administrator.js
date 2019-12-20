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
const typeorm_1 = require("typeorm");
let Administrator = class Administrator extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Administrator.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Administrator.prototype, "password", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.Index('IDX_QUESTION_USERNAME', { unique: true }),
    __metadata("design:type", String)
], Administrator.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Administrator.prototype, "first_name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Administrator.prototype, "last_name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Administrator.prototype, "role", void 0);
Administrator = __decorate([
    typeorm_1.Entity('administrators'),
    typeorm_1.Index('IDX_FULL_TEXT', ["username", "first_name", "last_name"], { fulltext: true })
], Administrator);
exports.Administrator = Administrator;
//# sourceMappingURL=Administrator.js.map