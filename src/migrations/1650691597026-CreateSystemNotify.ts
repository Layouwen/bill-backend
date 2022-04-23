import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSystemNotify1650691597026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'system_notify',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'content',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'isGlobal',
            type: 'tinyint',
            default: 1,
            isNullable: false,
          },
          {
            name: 'coverPicture',
            default: '""',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('system_notify');
  }
}
