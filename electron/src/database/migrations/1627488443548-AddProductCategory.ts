import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProductCategory1627488443548 implements MigrationInterface {
  name = 'AddProductCategory1627488443548'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "product_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(100), "sort" integer, "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), "deleted_at" datetime)'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "product_category"')
  }
}
