import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateStoreCashes1617145792700 implements MigrationInterface {
    name = 'CreateStoreCashes1617145792700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_cashes" ("id" varchar PRIMARY KEY NOT NULL, "code" varchar NOT NULL, "cash_id" integer NOT NULL, "history_id" integer NOT NULL, "store_id" integer NOT NULL, "amount_on_open" decimal(10,2) NOT NULL, "is_opened" boolean NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "store_cashes"`);
    }

}
