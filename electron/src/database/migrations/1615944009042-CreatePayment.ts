import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePayment1615944009042 implements MigrationInterface {
    name = 'CreatePayment1615944009042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payments" ("id" varchar PRIMARY KEY NOT NULL, "sale_id" varchar NOT NULL, "amount" decimal(10,2) NOT NULL, "type" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
        await queryRunner.query(`CREATE TABLE "temporary_payments" ("id" varchar PRIMARY KEY NOT NULL, "sale_id" varchar NOT NULL, "amount" decimal(10,2) NOT NULL, "type" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, CONSTRAINT "FK_a9272c4415ef64294b104e378ac" FOREIGN KEY ("sale_id") REFERENCES "sales" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_payments"("id", "sale_id", "amount", "type", "created_at", "deleted_at") SELECT "id", "sale_id", "amount", "type", "created_at", "deleted_at" FROM "payments"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`ALTER TABLE "temporary_payments" RENAME TO "payments"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" RENAME TO "temporary_payments"`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" varchar PRIMARY KEY NOT NULL, "sale_id" varchar NOT NULL, "amount" decimal(10,2) NOT NULL, "type" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
        await queryRunner.query(`INSERT INTO "payments"("id", "sale_id", "amount", "type", "created_at", "deleted_at") SELECT "id", "sale_id", "amount", "type", "created_at", "deleted_at" FROM "temporary_payments"`);
        await queryRunner.query(`DROP TABLE "temporary_payments"`);
        await queryRunner.query(`DROP TABLE "payments"`);
    }

}
