import {MigrationInterface, QueryRunner} from "typeorm";

export class createSales1600108901736 implements MigrationInterface {
    name = 'createSales1600108901736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "change_amount" decimal(8,2) NOT NULL, "cash_id" integer NOT NULL, "client_id" integer, "type" integer NOT NULL, "discount" decimal(8,2), "created_at" datetime NOT NULL DEFAULT (datetime('now')))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sales"`);
    }

}
