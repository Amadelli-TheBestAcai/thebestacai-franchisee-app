import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSettings1615944534764 implements MigrationInterface {
    name = 'CreateSettings1615944534764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" varchar PRIMARY KEY NOT NULL, "disabled_balance" boolean NOT NULL, "balance_port" varchar NOT NULL, "printer" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
