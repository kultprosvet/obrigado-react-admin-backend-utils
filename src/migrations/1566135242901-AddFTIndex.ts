import {MigrationInterface, QueryRunner, TableIndex} from 'typeorm'
export class AddFTIndex1566135242901 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createIndex(
            'administrators',
            new TableIndex({
                name: 'IDX_FULL_TEXT',
                isFulltext:true,
                columnNames: ['username','last_name','first_name'],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex('administrators','IDX_FULL_TEXT')
    }
}
