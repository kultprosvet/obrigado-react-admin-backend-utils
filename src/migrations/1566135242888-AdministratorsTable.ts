import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class AdministratorsTable1566135242888 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
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
            }),
            true
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
