import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSessionUser1615943956225 implements MigrationInterface {
    name = 'CreateSessionUser1615943956225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session_user" ("id" varchar PRIMARY KEY NOT NULL, "access_token" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "session_user"`);
    }

}
