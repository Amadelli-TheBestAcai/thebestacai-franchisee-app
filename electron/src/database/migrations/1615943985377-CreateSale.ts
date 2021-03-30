import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSale1615943985377 implements MigrationInterface {
  name = 'CreateSale1615943985377'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "sales" ("id" varchar PRIMARY KEY NOT NULL, "store_id" integer NOT NULL, "cash_history_id" integer, "cash_id" integer, "cash_code" varchar, "change_amount" decimal(10,2), "name" varchar, "type" varchar NOT NULL, "discount" decimal(10,2) , "total" decimal(10,2) , "quantity" integer , "to_integrate" boolean NOT NULL, "is_current" boolean NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), "deleted_at" datetime)'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "sales"')
  }
}
