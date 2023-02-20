import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CategoryAddType1653291928072 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'category',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['sub', 'add'],
        default: '"sub"',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('category', 'type');
  }
}
