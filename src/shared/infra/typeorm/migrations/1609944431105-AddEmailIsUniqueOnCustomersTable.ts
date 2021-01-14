import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddEmailIsUniqueOnCustomersTable1609944431105
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('customers', 'email');

    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('customers', 'email');

    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'email',
        type: 'varchar',
      }),
    );
  }
}
