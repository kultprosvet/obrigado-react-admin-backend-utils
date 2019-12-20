import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm'
export class AddRole1566135244000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn("administrators",
            new TableColumn({
                name: "role",
                type: "varchar",
                isNullable: true,
            }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("administrators", "role")
    }
}
