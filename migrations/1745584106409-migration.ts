import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1745584106409 implements MigrationInterface {
  name = 'Migration1745584106409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "product_category"
                             (
                               "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "name"        character varying NOT NULL,
                               "description" character varying NOT NULL,
                               "is_active"   boolean           NOT NULL DEFAULT true,
                               "created_at"  TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"  TIMESTAMP         NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "product"
                             (
                               "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "name"        character varying NOT NULL,
                               "description" text              NOT NULL,
                               "base_price"  numeric(10, 2)    NOT NULL,
                               "is_active"   boolean           NOT NULL DEFAULT true,
                               "category_id" uuid              NOT NULL,
                               "created_at"  TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"  TIMESTAMP         NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "product_option_group"
                             (
                               "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "name"         character varying NOT NULL,
                               "display_name" character varying NOT NULL,
                               "is_active"    boolean           NOT NULL DEFAULT true,
                               "product_id"   uuid              NOT NULL,
                               "created_at"   TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"   TIMESTAMP         NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_d76e92fdbbb5a2e6752ffd4a2c1" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "inventory_item"
                             (
                               "id"                uuid      NOT NULL DEFAULT uuid_generate_v4(),
                               "quantity"          integer   NOT NULL,
                               "out_of_stock"      boolean   NOT NULL DEFAULT false,
                               "product_option_id" uuid      NOT NULL,
                               "created_at"        TIMESTAMP NOT NULL DEFAULT now(),
                               "updated_at"        TIMESTAMP NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_94f5cbcb5f280f2f30bd4a9fd90" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "option_rule"
                             (
                               "id"             uuid                                  NOT NULL DEFAULT uuid_generate_v4(),
                               "rule_type"      "public"."option_rule_rule_type_enum" NOT NULL,
                               "if_option_id"   uuid                                  NOT NULL,
                               "then_option_id" uuid                                  NOT NULL,
                               "is_active"      boolean                               NOT NULL DEFAULT true,
                               "created_at"     TIMESTAMP                             NOT NULL DEFAULT now(),
                               "updated_at"     TIMESTAMP                             NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_e42fcd04a2c8f668643de59f6c0" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "option_price_rule"
                             (
                               "id"                  uuid           NOT NULL DEFAULT uuid_generate_v4(),
                               "price"               numeric(10, 2) NOT NULL,
                               "target_option_id"    uuid           NOT NULL,
                               "dependent_option_id" uuid           NOT NULL,
                               "is_active"           boolean        NOT NULL DEFAULT true,
                               "created_at"          TIMESTAMP      NOT NULL DEFAULT now(),
                               "updated_at"          TIMESTAMP      NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_d8b46e6fca8919eaf120359816b" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "product_option"
                             (
                               "id"              uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "name"            character varying NOT NULL,
                               "display_name"    character varying NOT NULL,
                               "base_price"      numeric(10, 2)    NOT NULL,
                               "is_active"       boolean           NOT NULL DEFAULT true,
                               "option_group_id" uuid              NOT NULL,
                               "created_at"      TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"      TIMESTAMP         NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_4cf3c467e9bc764bdd32c4cd938" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "cart_item_option"
                             (
                               "id"           uuid      NOT NULL DEFAULT uuid_generate_v4(),
                               "cart_item_id" uuid      NOT NULL,
                               "option_id"    uuid      NOT NULL,
                               "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
                               "updated_at"   TIMESTAMP NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_656fab95924d74a84258437a279" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "cart_item"
                             (
                               "id"         uuid      NOT NULL DEFAULT uuid_generate_v4(),
                               "cart_id"    uuid      NOT NULL,
                               "product_id" uuid      NOT NULL,
                               "quantity"   integer   NOT NULL DEFAULT '1',
                               "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                               "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "cart"
                             (
                               "id"         uuid      NOT NULL DEFAULT uuid_generate_v4(),
                               "user_id"    uuid      NOT NULL,
                               "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                               "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                               CONSTRAINT "REL_f091e86a234693a49084b4c2c8" UNIQUE ("user_id"),
                               CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "user"
      ADD "is_active" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "user"
      ADD "roles" "public"."user_roles_enum" array NOT NULL DEFAULT '{customer}'`);
    await queryRunner.query(`ALTER TABLE "user"
      ALTER COLUMN "created_at" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user"
      ALTER COLUMN "updated_at" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "product"
      ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "product_category" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "product_option_group"
      ADD CONSTRAINT "FK_28f273fec3a8f15a46494a1e5cf" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "inventory_item"
      ADD CONSTRAINT "FK_172fb04d0ba450927dee0d43bd5" FOREIGN KEY ("product_option_id") REFERENCES "product_option" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "option_rule"
      ADD CONSTRAINT "FK_378e92db619805e84ff995dc580" FOREIGN KEY ("if_option_id") REFERENCES "product_option" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "option_rule"
      ADD CONSTRAINT "FK_0eb9ddecb1a68d8024d4c6dcf1e" FOREIGN KEY ("then_option_id") REFERENCES "product_option" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "option_price_rule"
      ADD CONSTRAINT "FK_d5af705a18922540be901bfd17a" FOREIGN KEY ("target_option_id") REFERENCES "product_option" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "option_price_rule"
      ADD CONSTRAINT "FK_f6d6441783ad4167bd921553b82" FOREIGN KEY ("dependent_option_id") REFERENCES "product_option" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "product_option"
      ADD CONSTRAINT "FK_882a199b6bdc3da9a251729946d" FOREIGN KEY ("option_group_id") REFERENCES "product_option_group" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "cart_item_option"
      ADD CONSTRAINT "FK_0faca5bd9d53e911eb97073eb59" FOREIGN KEY ("cart_item_id") REFERENCES "cart_item" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "cart_item_option"
      ADD CONSTRAINT "FK_3eb5ed0b8d49f3448a2086750e0" FOREIGN KEY ("option_id") REFERENCES "product_option" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "cart_item"
      ADD CONSTRAINT "FK_b6b2a4f1f533d89d218e70db941" FOREIGN KEY ("cart_id") REFERENCES "cart" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "cart_item"
      ADD CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "cart"
      ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cart"
      DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`);
    await queryRunner.query(`ALTER TABLE "cart_item"
      DROP CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e"`);
    await queryRunner.query(`ALTER TABLE "cart_item"
      DROP CONSTRAINT "FK_b6b2a4f1f533d89d218e70db941"`);
    await queryRunner.query(`ALTER TABLE "cart_item_option"
      DROP CONSTRAINT "FK_3eb5ed0b8d49f3448a2086750e0"`);
    await queryRunner.query(`ALTER TABLE "cart_item_option"
      DROP CONSTRAINT "FK_0faca5bd9d53e911eb97073eb59"`);
    await queryRunner.query(`ALTER TABLE "product_option"
      DROP CONSTRAINT "FK_882a199b6bdc3da9a251729946d"`);
    await queryRunner.query(`ALTER TABLE "option_price_rule"
      DROP CONSTRAINT "FK_f6d6441783ad4167bd921553b82"`);
    await queryRunner.query(`ALTER TABLE "option_price_rule"
      DROP CONSTRAINT "FK_d5af705a18922540be901bfd17a"`);
    await queryRunner.query(`ALTER TABLE "option_rule"
      DROP CONSTRAINT "FK_0eb9ddecb1a68d8024d4c6dcf1e"`);
    await queryRunner.query(`ALTER TABLE "option_rule"
      DROP CONSTRAINT "FK_378e92db619805e84ff995dc580"`);
    await queryRunner.query(`ALTER TABLE "inventory_item"
      DROP CONSTRAINT "FK_172fb04d0ba450927dee0d43bd5"`);
    await queryRunner.query(`ALTER TABLE "product_option_group"
      DROP CONSTRAINT "FK_28f273fec3a8f15a46494a1e5cf"`);
    await queryRunner.query(`ALTER TABLE "product"
      DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`);
    await queryRunner.query(`ALTER TABLE "user"
      ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
    await queryRunner.query(`ALTER TABLE "user"
      ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
    await queryRunner.query(`ALTER TABLE "user"
      DROP COLUMN "roles"`);
    await queryRunner.query(`ALTER TABLE "user"
      DROP COLUMN "is_active"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "cart_item"`);
    await queryRunner.query(`DROP TABLE "cart_item_option"`);
    await queryRunner.query(`DROP TABLE "product_option"`);
    await queryRunner.query(`DROP TABLE "option_price_rule"`);
    await queryRunner.query(`DROP TABLE "option_rule"`);
    await queryRunner.query(`DROP TABLE "inventory_item"`);
    await queryRunner.query(`DROP TABLE "product_option_group"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "product_category"`);
  }
}
