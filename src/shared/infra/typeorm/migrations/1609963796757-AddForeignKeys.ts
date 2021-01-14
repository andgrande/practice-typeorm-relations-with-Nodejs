import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddForeignKeys1609963796757 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'customerId',
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'orderId',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'orderProducts',
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // await queryRunner.createForeignKey(
    //   'orders_products',
    //   new TableForeignKey({
    //     name: 'productPrice',
    //     columnNames: ['price'],
    //     referencedColumnNames: ['price'],
    //     referencedTableName: 'products',
    //     onDelete: 'SET NULL',
    //     onUpdate: 'CASCADE',
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropForeignKey('orders_products', 'productPrice');
    await queryRunner.dropForeignKey('orders_products', 'orderProducts');
    await queryRunner.dropForeignKey('orders_products', 'orderId');
    await queryRunner.dropForeignKey('orders', 'customerId');
    await queryRunner.dropColumn('orders', 'customer_id');
  }
}
