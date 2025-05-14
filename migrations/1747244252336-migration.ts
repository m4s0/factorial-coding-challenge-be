import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747244252336 implements MigrationInterface {
  name = 'Migration1747244252336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item_option" ADD "price" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD "price" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD "total_price" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD "total_price" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_item" DROP CONSTRAINT "FK_172fb04d0ba450927dee0d43bd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_item" ADD CONSTRAINT "UQ_172fb04d0ba450927dee0d43bd5" UNIQUE ("product_option_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_item" ADD CONSTRAINT "FK_172fb04d0ba450927dee0d43bd5" FOREIGN KEY ("product_option_id") REFERENCES "product_option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory_item" DROP CONSTRAINT "FK_172fb04d0ba450927dee0d43bd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_item" DROP CONSTRAINT "UQ_172fb04d0ba450927dee0d43bd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_item" ADD CONSTRAINT "FK_172fb04d0ba450927dee0d43bd5" FOREIGN KEY ("product_option_id") REFERENCES "product_option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "total_price"`);
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP COLUMN "total_price"`,
    );
    await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "cart_item_option" DROP COLUMN "price"`,
    );
  }
}
