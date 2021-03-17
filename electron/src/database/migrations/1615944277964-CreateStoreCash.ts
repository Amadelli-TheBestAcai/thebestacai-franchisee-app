import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateStoreCash1615944277964 implements MigrationInterface {
    name = 'CreateStoreCash1615944277964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_cash" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "store_cash"`);
    }

}
