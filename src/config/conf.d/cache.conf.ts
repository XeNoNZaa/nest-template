/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as redisStore from 'cache-manager-ioredis';
import IORedis from 'ioredis';
const { CACHE_TYPE, CACHE_TTL } = process.env;

/**
 * RedisOptions interface
 * @interface RedisOptions
 * @property {string} host - The Redis host
 * @property {number} port - The Redis port
 * @property {string} username - The Redis username
 * @property {string} password - The Redis password
 * @property {number} db - The Redis database number
 * @property {number} [ttl] - The Redis time to live (optional)
 */
type RedisOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  db: number;
  ttl?: number;
  keyPrefix?: string;
};

/**
 * Get the cache configuration for Redis
 * @param scope - The scope of the cache configuration (e.g. 'test', 'prod')
 * @returns {RedisOptions} - The Redis options
 * @throws {Error} - If the host is not defined
 */
const getCacheConfig = (scope?: string) => {
  const _scope = scope ? `_${scope.toUpperCase()}_` : `_`;
  return {
    host: process.env[`REDIS${_scope}HOST`],
    port: Number(process.env[`REDIS${_scope}PORT`]),
    username: process.env[`REDIS${_scope}USERNAME`],
    password: process.env[`REDIS${_scope}PASSWORD`],
    db: Number(process.env[`REDIS${_scope}DB`]),
    ttl: Number(process.env[`REDIS${_scope}TTL`] || process.env.REDIS_TTL || CACHE_TTL),
    // keyPrefix: 'nest_cache:',
  } as RedisOptions;
};

/**
 * Cache configuration factory
 * @function factory
 * @description This function creates a cache configuration object based on the CACHE_TYPE environment variable.
 * @returns {object} - The cache configuration object
 * @throws {Error} - If the CACHE_TYPE is not defined
 */
function factory() {
  if (!CACHE_TYPE) {
    throw new Error('CACHE_TYPE is not defined');
  }
  console.log(`CACHE_TYPE: ${CACHE_TYPE}`);
  switch (CACHE_TYPE) {
    case 'redis':
      return redisConfigFactory();
    case 'memory':
    default:
      return {};
  }
}

/**
 * Redis configuration factory
 * @returns {object} - The Redis configuration object
 * @throws {Error} - If the host is not defined
 */
function redisConfigFactory() {
  const masterConfig = getCacheConfig();
  const masterClient = new IORedis(masterConfig);

  setInterval(async () => {
    // console.log('Master redis status:', masterClient.status, await masterClient.ping());
    await masterClient.set('ping', Date.now());
  }, 5000);

  const replicas: RedisOptions[] = [];
  for (let i = 1; i <= 10; i++) {
    const replicaConfig = getCacheConfig(i.toString());
    if (replicaConfig.host) {
      replicas.push(replicaConfig);
    }
  }
  return {
    store: redisStore,
    redisInstance: masterClient,
    replicas,
  };
}

/**
 * Cache configuration object
 */
// console.log('Cache configuration:', factory());
export default factory();
