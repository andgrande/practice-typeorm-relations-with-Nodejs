import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddFloatingPointToPriceColumnInProductsTable1610495636863
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'price');
    await queryRunner.dropColumn('products', 'price');
    await queryRunner.dropColumn('orders_products', 'quantity');
    await queryRunner.dropColumn('products', 'quantity');

    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'price',
        type: 'decimal',
        precision: 6,
        scale: 2,
      }),
    );

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'price',
        type: 'decimal',
        precision: 6,
        scale: 2,
      }),
    );

    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'quantity',
        type: 'int',
      }),
    );

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'quantity',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'price');
    await queryRunner.dropColumn('products', 'price');
    await queryRunner.dropColumn('orders_products', 'quantity');
    await queryRunner.dropColumn('products', 'quantity');

    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'price',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'price',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'quantity',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'quantity',
        type: 'varchar',
      }),
    );
  }
}
