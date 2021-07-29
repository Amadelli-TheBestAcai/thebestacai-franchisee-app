import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddItem1627488091010 implements MigrationInterface {
  name = 'AddItem1627488091010'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "items" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "product_id" integer NOT NULL, "category_id" integer NOT NULL, "product_store_id" integer NOT NULL, "price_unit" decimal(10,2) NOT NULL, "quantity" decimal(10,2) NOT NULL, "total" decimal(10,2) NOT NULL, "sale_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), "deleted_at" datetime, CONSTRAINT "FK_1fb7534cc43a8549bc47037abf0" FOREIGN KEY ("sale_id") REFERENCES "sales" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "items"')
  }
}
