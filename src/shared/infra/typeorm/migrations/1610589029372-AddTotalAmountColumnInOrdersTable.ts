import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTotalAmountColumnInOrdersTable1610589029372
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'total_amount',
        type: 'decimal',
        isNullable: true,
        precision: 6,
        scale: 2,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'total_amount');
  }
}
