import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSale1615943985377 implements MigrationInterface {
    name = 'CreateSale1615943985377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales" ("id" varchar PRIMARY KEY NOT NULL, "store_id" integer NOT NULL, "cash_history_id" integer NOT NULL, "cash_id" integer NOT NULL, "cash_code" varchar NOT NULL, "change_amount" decimal(10,2) NOT NULL, "name" varchar NOT NULL, "type" varchar NOT NULL, "discount" decimal(10,2) NOT NULL, "total" decimal(10,2) NOT NULL, "quantity" varchar NOT NULL, "to_integrate" boolean NOT NULL, "is_current" boolean NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sales"`);
    }

}
