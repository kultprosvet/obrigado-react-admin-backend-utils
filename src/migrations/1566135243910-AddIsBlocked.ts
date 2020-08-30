import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
export class AddIsBlocked1566135243910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "administrators",
      new TableColumn({
        name: "isBlocked",
        type: "boolean",
        isNullable: false,
        default: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("administrators", "role");
  }
}
