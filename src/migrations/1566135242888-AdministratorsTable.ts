import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'
import {Table} from "typeorm/index"

export class AdministratorsTable1566135242888 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "administrators",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "username",
                    type: "varchar",
                },
                {
                    name: "last_name",
                    type: "varchar",
                },
                {
                    name: "first_name",
                    type: "varchar",
                },
                {
                    name: "password",
                    type: "varchar",
                }

            ]
        }), true)
        await queryRunner.createIndex(
            'administrators',
            new TableIndex({
                name: 'IDX_QUESTION_USERNAME',
                isUnique: true,
                columnNames: ['username'],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('administrators')
    }
}
