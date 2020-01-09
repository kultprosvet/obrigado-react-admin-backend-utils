"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class AddIsBlocked1566135243910 {
    async up(queryRunner) {
        await queryRunner.addColumn("administrators", new typeorm_1.TableColumn({
            name: "isBlocked",
            type: "tinyint",
            isNullable: false,
            default: 0
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("administrators", "role");
    }
}
exports.AddIsBlocked1566135243910 = AddIsBlocked1566135243910;
//# sourceMappingURL=1566135243910-AddIsBlocked.js.map