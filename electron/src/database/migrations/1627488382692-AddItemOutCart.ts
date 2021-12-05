import {MigrationInterface, QueryRunner} from "typeorm";

export class AddItemOutCart1627488382692 implements MigrationInterface {
    name = 'AddItemOutCart1627488382692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "items_out_cart" ("id" varchar PRIMARY KEY NOT NULL, "reason" varchar NOT NULL, "product_id" integer NOT NULL, "store_id" integer NOT NULL, "integrated" boolean NOT NULL DEFAULT (0), "cash_code" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "items_out_cart"`);
    }

}
