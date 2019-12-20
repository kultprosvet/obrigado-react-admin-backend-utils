"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class AdministratorsTable1566135242888 {
    async up(queryRunner) {
        await queryRunner.query('CREATE TABLE `administrators` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `last_name` varchar(255) NULL, `first_name` varchar(255) NULL, `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
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