import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNfeFieldsToProducts1625183586246 implements MigrationInterface {
  name = 'AddNfeFieldsToProducts1625183586246'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "products" ADD "unity_taxable" varchar'
    )
    await queryRunner.query('ALTER TABLE "products" ADD "cod_ncm" integer')
    await queryRunner.query('ALTER TABLE "products" ADD "cfop" integer')
    await queryRunner.query(
      'ALTER TABLE "products" ADD "price_taxable" integer'
    )
    await queryRunner.query(
      'ALTER TABLE "products" ADD "icms_tax_situation" integer'
    )
    await queryRunner.query('ALTER TABLE "products" ADD "icms_origin" integer')
    await queryRunner.query(
      'ALTER TABLE "products" ADD "additional_information" varchar'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "products" DROP COLUMN "additional_information"'
    )
    await queryRunner.query('ALTER TABLE "products" DROP COLUMN "icms_origin"')
    await queryRunner.query(
      'ALTER TABLE "products" DROP COLUMN "icms_tax_situation"'
    )
    await queryRunner.query(
      'ALTER TABLE "products" DROP COLUMN "price_taxable"'
    )
    await queryRunner.query('ALTER TABLE "products" DROP COLUMN "cfop"')
    await queryRunner.query('ALTER TABLE "products" DROP COLUMN "cod_ncm"')
    await queryRunner.query(
      'ALTER TABLE "products" DROP COLUMN "unity_taxable"'
    )
  }
}