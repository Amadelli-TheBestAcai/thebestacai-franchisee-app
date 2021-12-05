import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProductStore1627488863480 implements MigrationInterface {
  name = 'AddProductStore1627488863480'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "product_store" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "product_id" integer, "store_id" integer, "price_unit" decimal(8,2), "permission" boolean NOT NULL DEFAULT (0), "price_sell" decimal(8,2), "unity" varchar, "unity_taxable" varchar, "price_taxable" decimal(8,2), "cfop" integer, "icms_origin" integer, "icms_tax_situation" varchar, "tax_regime" integer, "pis_tax_situation" varchar, "pis_aliquot_value" decimal(8,2), "pis_aliquot_percentage" decimal(8,2), "cofins_tax_situation" varchar, "cofins_aliquot_value" decimal(8,2), "cofins_aliquot_percentage" decimal(8,2), "additional_information" varchar, "price_permission" boolean NOT NULL DEFAULT (0), "icms_aliquot_percentage" decimal(8,2), "bc_icms" decimal(8,2), "bc_icms_st" decimal(8,2), "redution_icms" decimal(8,2), "aliquot_final_consumer" decimal(8,2), "quantity" integer, "created_at" datetime NOT NULL DEFAULT (datetime(\'now\')), "deleted_at" datetime)'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "product_store"')
  }
}
