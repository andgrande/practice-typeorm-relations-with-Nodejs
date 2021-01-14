import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddDiscountRateColumnInProductsTable1610631655018
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'discount_rate',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'discount_rate',
        type: 'int',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'discount_rate');
    await queryRunner.dropColumn('products', 'discount_rate');
  }
}
