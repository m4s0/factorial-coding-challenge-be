import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1745054062538 implements MigrationInterface {
  name = 'Migration1745054062538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user"
                             (
                                 "id"         uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                                 "email"      character varying(100) NOT NULL,
                                 "password"   character varying(100) NOT NULL,
                                 "username"   character varying(100),
                                 "first_name" character varying(100),
                                 "last_name"  character varying(100),
                                 "created_at" TIMESTAMP              NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                                 "updated_at" TIMESTAMP              NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                                 CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                                 CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
