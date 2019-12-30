import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
export class AddIsBlocked1566135243910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "administrators",
      new TableColumn({
        name: "isBlocked",
        type: "tinyint",
        isNullable: false,
        default: 0
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("administrators", "role");
  }
}
