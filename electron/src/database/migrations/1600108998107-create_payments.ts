import {MigrationInterface, QueryRunner} from "typeorm";

export class createPayments1600108998107 implements MigrationInterface {
    name = 'createPayments1600108998107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sale_payments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" decimal(8,2) NOT NULL, "type" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sale_id" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_sale_payments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" decimal(8,2) NOT NULL, "type" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sale_id" integer, CONSTRAINT "FK_0e4445597642c2456ebdd7e23b1" FOREIGN KEY ("sale_id") REFERENCES "sales" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sale_payments"("id", "amount", "type", "created_at", "sale_id") SELECT "id", "amount", "type", "created_at", "sale_id" FROM "sale_payments"`);
        await queryRunner.query(`DROP TABLE "sale_payments"`);
        await queryRunner.query(`ALTER TABLE "temporary_sale_payments" RENAME TO "sale_payments"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_payments" RENAME TO "temporary_sale_payments"`);
        await queryRunner.query(`CREATE TABLE "sale_payments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" decimal(8,2) NOT NULL, "type" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sale_id" integer)`);
        await queryRunner.query(`INSERT INTO "sale_payments"("id", "amount", "type", "created_at", "sale_id") SELECT "id", "amount", "type", "created_at", "sale_id" FROM "temporary_sale_payments"`);
        await queryRunner.query(`DROP TABLE "temporary_sale_payments"`);
        await queryRunner.query(`DROP TABLE "sale_payments"`);
    }

}
