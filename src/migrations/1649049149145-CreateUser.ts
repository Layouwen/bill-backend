import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1649049149145 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isNullable: false },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'tinyint',
            isNullable: false,
            default: 1,
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: false,
            default:
              "'https:,//bill-rearend.oss-cn-guangzhou.aliyuncs.com/static/defulatAvatar.jpg'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'current_timestamp',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'current_timestamp',
            isNullable: false,
            onUpdate: 'current_timestamp',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
