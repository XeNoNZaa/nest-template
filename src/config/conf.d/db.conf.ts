import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * DatabaseConfig interface
 * @interface DatabaseConfig
 * @property {string} host - The database host
 * @property {number} port - The database port
 * @property {string} username - The database username
 * @property {string} password - The database password
 * @property {string} db - The database name
 */
interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface CacheConfig {
  type: string;
  tableName?: string;
  duration: number;
  options?: {
    host: string;
    password: string;
    port: number;
    db: number;
    keyPrefix: string;
  };
}

/**
 * Load database configuration
 * @param scope - The scope of the database configuration (e.g. 'test', 'prod')
 * @returns {DatabaseConfig} - The database configuration
 * @throws {Error} - If the host is not defined
 */
function loadDatabaseConfig(scope: string): DatabaseConfig {
  return {
    host: process.env[`${scope}_HOST`] || 'localhost',
    port: parseInt(process.env[`${scope}_PORT`] || '5432', 10),
    username: process.env[`${scope}_USER`] || 'postgres',
    password: process.env[`${scope}_PASSWORD`] || '',
    database: process.env[`${scope}_DB`] || '',
  };
}

function getDatabaseCacheConfig(): CacheConfig | null {
  if (!process.env.DB_CACHE_ENABLED) return null;
  if (process.env.DB_CACHE_ENABLED !== 'true') return null;

  const cacheType = process.env.DB_CACHE_TYPE;
  if (!cacheType) return null;
  if (cacheType !== 'ioredis' && cacheType !== 'database') return null;
  if (cacheType === 'ioredis' && !process.env.REDIS_HOST) return null;
  if (cacheType === 'database' && !process.env.DB_CACHE_TABLE) return null;

  const cacheDuration = parseInt(process.env.DB_CACHE_DURATION || '30', 10); // Default to 30 seconds

  switch (cacheType) {
    case 'ioredis':
      return {
        type: 'ioredis',
        duration: 60000,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          password: process.env.REDIS_PASSWORD || '',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          db: parseInt(process.env.REDIS_DB || '0', 10),
          keyPrefix: process.env.REDIS_KEY_PREFIX || 'typeorm_cache',
        },
      };
    case 'database':
      return {
        type: 'database',
        tableName: '_query_result_cache',
        duration: cacheDuration,
      };
    default:
      return null;
  }
}

/**
 * TypeOrmConfig interface
 * @interface TypeOrmConfig
 */
export default {
  type: process.env.DB_TYPE || 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.TYPEORM_SYNC === 'true',
  replication: {
    master: loadDatabaseConfig('DB_MASTER'),
    slaves: [],
    // slaves: Array.from({ length: parseInt(process.env.DB_SLAVE_COUNT || '0', 10) }, (_, idx) => loadDatabaseConfig(`DB_SLAVE_${idx + 1}`)),
  },
  extra: {
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      min: parseInt(process.env.DB_POOL_MIN || '5', 10),
      idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE || '30000', 10),
      acquireTimeoutMillis: parseInt(process.env.DB_POOL_ACQUIRE || '60000', 10),
    },
  },
  cache: getDatabaseCacheConfig(),
  logging: process.env.DB_LOGGING === 'true',
  logger: process.env.DB_LOGGING_FORMAT || 'advanced-console',
  logLevels: [process.env.DB_LOGGING_LEVEL || 'info'],
} as TypeOrmModuleOptions;

// console.log(Array.from({ length: parseInt(process.env.DB_SLAVE_COUNT || '0', 10) }, (_, idx) => loadDatabaseConfig(`DB_SLAVE_${idx + 1}`)));
