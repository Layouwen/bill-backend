// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./ormconfig.base.js');

module.exports = [
  {
    ...baseConfig,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: './src/migrations',
    },
  },
  {
    ...baseConfig,
    name: 'seed',
    migrations: ['dist/migrations/seed/*{.ts,.js}'],
    cli: {
      migrationsDir: './src/migrations/seed',
    },
  },
];
