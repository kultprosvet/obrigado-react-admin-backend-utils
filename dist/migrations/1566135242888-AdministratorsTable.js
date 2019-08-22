"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class AdministratorsTable1566135242888 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'administrators',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'username',
                    type: 'varchar',
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
            ],
        }), true);
        await queryRunner.createIndex('administrators', new typeorm_1.TableIndex({
            name: 'IDX_QUESTION_USERNAME',
            isUnique: true,
            columnNames: ['username'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('administrators');
    }
}
exports.AdministratorsTable1566135242888 = AdministratorsTable1566135242888;
//# sourceMappingURL=1566135242888-AdministratorsTable.js.map