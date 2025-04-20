interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  db: string;
}

function loadDatabaseConfig(scope: string): DatabaseConfig {
  return {
    host: process.env[`${scope}_HOST`] || 'localhost',
    port: parseInt(process.env[`${scope}_PORT`] || '5432', 10),
    username: process.env[`${scope}_USER`] || 'postgres',
    password: process.env[`${scope}_PASSWORD`] || '',
    db: process.env[`${scope}_DB`] || '',
  };
}

export const typeOrmConfig = {
  type: process.env.DB_TYPE || 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.TYPEORM_SYNC === 'true',
  replication: {
    master: loadDatabaseConfig('DB_MASTER'),
    slaves: Array.from(
      { length: parseInt(process.env.DB_SLAVE_COUNT || '0', 10) },
      (_, idx) => loadDatabaseConfig(`DB_SLAVE_${idx + 1}`),
    ),
  },
  extra: {
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      min: parseInt(process.env.DB_POOL_MIN || '5', 10),
      idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE || '30000', 10),
      acquireTimeoutMillis: parseInt(
        process.env.DB_POOL_ACQUIRE || '60000',
        10,
      ),
    },
  },
  logging: process.env.DB_LOGGING === 'true',
  logger: process.env.DB_LOGGING_FORMAT || 'advanced-console',
  logLevels: [process.env.DB_LOGGING_LEVEL || 'info'],
};

console.log('this', typeOrmConfig.replication.slaves[0]);
