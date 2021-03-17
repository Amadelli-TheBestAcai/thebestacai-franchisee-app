import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateItem1615944078899 implements MigrationInterface {
    name = 'CreateItem1615944078899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "items" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "product_id" integer NOT NULL, "category_id" integer NOT NULL, "product_store_id" integer NOT NULL, "price_unit" decimal(10,2) NOT NULL, "quantity" decimal(10,2) NOT NULL, "total" decimal(10,2) NOT NULL, "sale_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
        await queryRunner.query(`CREATE TABLE "temporary_items" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "product_id" integer NOT NULL, "category_id" integer NOT NULL, "product_store_id" integer NOT NULL, "price_unit" decimal(10,2) NOT NULL, "quantity" decimal(10,2) NOT NULL, "total" decimal(10,2) NOT NULL, "sale_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, CONSTRAINT "FK_1fb7534cc43a8549bc47037abf0" FOREIGN KEY ("sale_id") REFERENCES "sales" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_items"("id", "name", "product_id", "category_id", "product_store_id", "price_unit", "quantity", "total", "sale_id", "created_at", "deleted_at") SELECT "id", "name", "product_id", "category_id", "product_store_id", "price_unit", "quantity", "total", "sale_id", "created_at", "deleted_at" FROM "items"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`ALTER TABLE "temporary_items" RENAME TO "items"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" RENAME TO "temporary_items"`);
        await queryRunner.query(`CREATE TABLE "items" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "product_id" integer NOT NULL, "category_id" integer NOT NULL, "product_store_id" integer NOT NULL, "price_unit" decimal(10,2) NOT NULL, "quantity" decimal(10,2) NOT NULL, "total" decimal(10,2) NOT NULL, "sale_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
        await queryRunner.query(`INSERT INTO "items"("id", "name", "product_id", "category_id", "product_store_id", "price_unit", "quantity", "total", "sale_id", "created_at", "deleted_at") SELECT "id", "name", "product_id", "category_id", "product_store_id", "price_unit", "quantity", "total", "sale_id", "created_at", "deleted_at" FROM "temporary_items"`);
        await queryRunner.query(`DROP TABLE "temporary_items"`);
        await queryRunner.query(`DROP TABLE "items"`);
    }

}
