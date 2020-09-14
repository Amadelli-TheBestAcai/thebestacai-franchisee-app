import {MigrationInterface, QueryRunner} from "typeorm";

export class createProducts1600109305069 implements MigrationInterface {
    name = 'createProducts1600109305069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "category_id" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sale_id" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_products" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "category_id" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sale_id" integer, CONSTRAINT "FK_d5b7b959699a980c0dca43fcef8" FOREIGN KEY ("sale_id") REFERENCES "sales" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_products"("id", "category_id", "created_at", "sale_id") SELECT "id", "category_id", "created_at", "sale_id" FROM "products"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`ALTER TABLE "temporary_products" RENAME TO "products"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME TO "temporary_products"`);
        await queryRunner.query(`CREATE TABLE "products" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "category_id" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sale_id" integer)`);
        await queryRunner.query(`INSERT INTO "products"("id", "category_id", "created_at", "sale_id") SELECT "id", "category_id", "created_at", "sale_id" FROM "temporary_products"`);
        await queryRunner.query(`DROP TABLE "temporary_products"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
