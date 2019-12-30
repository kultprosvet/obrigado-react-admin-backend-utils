"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class AddRole1566135244000 {
    async up(queryRunner) {
        await queryRunner.addColumn("administrators", new typeorm_1.TableColumn({
            name: "role",
            type: "varchar",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("administrators", "role");
    }
}
exports.AddRole1566135244000 = AddRole1566135244000;
//# sourceMappingURL=1566135243901-AddRole.js.map