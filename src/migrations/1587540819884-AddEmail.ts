import {MigrationInterface, QueryRunner, TableColumn, TableIndex} from 'typeorm'

export class AddEmail1587540819884 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            "administrators",
            new TableColumn({
                name: "email",
                type: "varchar",
                length:"200",
                isNullable: true,
            }))
        await queryRunner.createIndex('administrators',new TableIndex({name:'idx_email',isUnique:true,columnNames:['email']}))

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("administrators", "email");
    }
}
