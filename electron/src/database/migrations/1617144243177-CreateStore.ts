import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateStore1617144243177 implements MigrationInterface {
    name = 'CreateStore1617144243177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stores" ("id" varchar PRIMARY KEY NOT NULL, "store_id" integer NOT NULL, "cnpj" varchar NOT NULL, "company_name" varchar NOT NULL, "token_nfce" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stores"`);
    }

}
