import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateProduct1615944152246 implements MigrationInterface {
    name = 'CreateProduct1615944152246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" varchar PRIMARY KEY NOT NULL, "product_id" integer NOT NULL, "product_store_id" integer NOT NULL, "category_id" integer NOT NULL, "name" varchar NOT NULL, "category_name" varchar NOT NULL, "price_unit" decimal(10,2) NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
