import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCashHandler1615944183320 implements MigrationInterface {
    name = 'CreateCashHandler1615944183320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cash_handlers" ("id" varchar PRIMARY KEY NOT NULL, "cash_id" integer NOT NULL, "cash_code" varchar NOT NULL, "store_id" integer NOT NULL, "cash_history_id" integer NOT NULL, "type" varchar NOT NULL, "reason" varchar NOT NULL, "amount" decimal(10,2) NOT NULL, "to_integrate" boolean NOT NULL, "order_id" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cash_handlers"`);
    }

}
