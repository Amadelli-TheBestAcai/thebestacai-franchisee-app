import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNfeToSale1625615760544 implements MigrationInterface {
  name = 'AddNfeToSale1625615760544'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sales" ADD "nfce_url" varchar')
    await queryRunner.query('ALTER TABLE "sales" ADD "nfce_id" integer')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sales" DROP COLUMN "nfce_id"')
    await queryRunner.query('ALTER TABLE "sales" DROP COLUMN "nfce_url"')
  }
}
