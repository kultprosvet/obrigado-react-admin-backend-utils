import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class AdministratorsTable1566135242888 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            'CREATE TABLE `administrators` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `last_name` varchar(255) NULL, `first_name` varchar(255) NULL, `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
        )

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
