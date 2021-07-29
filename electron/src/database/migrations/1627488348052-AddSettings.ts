import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSettings1627488348052 implements MigrationInterface {
    name = 'AddSettings1627488348052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" varchar PRIMARY KEY NOT NULL, "disabled_balance" boolean, "balance_port" varchar, "printer" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
