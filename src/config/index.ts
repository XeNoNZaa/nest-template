import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import packageJson from '../../package.json';

import secretConfig from './conf.d/secret.conf';
import loggerConfig from './conf.d/logger.conf';
import typeOrmConfig from './conf.d/db.conf';
import cacheConfig from './conf.d/cache.conf';
import rabbitmqConfig from './conf.d/rabbitmq.conf';

// console.table(Object.entries(process.env).map(([key, value]) => ({ key, value: value?.slice(0, 120) })));

interface IPackageJson {
  name: string;
  version: string;
}
const typePackageJson = packageJson as unknown as IPackageJson;

export interface IConfig {
  port: number;
  app: {
    name: string;
    version: string;
  };
  secret: typeof secretConfig;
  database: typeof typeOrmConfig;
  logger: typeof loggerConfig;
  cache: typeof cacheConfig;
  rabbitmq: typeof rabbitmqConfig;
}

export default (): IConfig => ({
  port: parseInt(process.env.PORT || '8001', 10),
  app: {
    name: typePackageJson.name,
    version: typePackageJson.version,
  },
  secret: secretConfig,
  logger: loggerConfig,
  database: typeOrmConfig,
  cache: cacheConfig,
  rabbitmq: rabbitmqConfig,
});
