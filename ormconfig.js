// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./ormconfig.base.js');

module.exports = [
  {
    ...baseConfig.development,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: './src/migrations',
    },
  },
  {
    ...baseConfig.test,
    name: 'test',
    migrations: ['dist/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: './src/migrations',
    },
  },
  {
    ...baseConfig.production,
    name: 'prod',
    migrations: ['dist/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: './src/migrations',
    },
  },
];
