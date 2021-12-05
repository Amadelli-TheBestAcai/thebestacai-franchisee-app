import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProduct1627490743930 implements MigrationInterface {
  name = 'AddProduct1627490743930'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "products" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(100), "category_id" integer, "product_store_id" integer, "price_buy" decimal(8,2), "permission_store" boolean DEFAULT (0), "permission_order" boolean DEFAULT (0), "permission_purchase" boolean DEFAULT (0), "cod_product" varchar, "cod_ncm" integer, "brand" varchar, "unity" integer, "weight" decimal(10,4), "price_sell" decimal(8,2), "description" varchar, "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), "deleted_at" datetime, CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "product_category" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_4fe429e02c5864695359d32cb13" FOREIGN KEY ("product_store_id") REFERENCES "product_store" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "products"')
  }
}
