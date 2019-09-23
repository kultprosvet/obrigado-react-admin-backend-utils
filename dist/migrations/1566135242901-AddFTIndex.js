"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class AddFTIndex1566135242901 {
    async up(queryRunner) {
        await queryRunner.createIndex('administrators', new typeorm_1.TableIndex({
            name: 'IDX_FULL_TEXT',
            isFulltext: true,
            columnNames: ['username', 'last_name', 'first_name'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('administrators', 'IDX_FULL_TEXT');
    }
}
exports.AddFTIndex1566135242901 = AddFTIndex1566135242901;
//# sourceMappingURL=1566135242901-AddFTIndex.js.map