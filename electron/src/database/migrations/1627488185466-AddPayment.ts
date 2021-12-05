import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPayment1627488185466 implements MigrationInterface {
  name = 'AddPayment1627488185466'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "payments" ("id" varchar PRIMARY KEY NOT NULL, "sale_id" varchar NOT NULL, "amount" decimal(10,2) NOT NULL, "type" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), "deleted_at" datetime, CONSTRAINT "FK_a9272c4415ef64294b104e378ac" FOREIGN KEY ("sale_id") REFERENCES "sales" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "payments"')
  }
}
