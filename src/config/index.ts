import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
dotenv.config({ path: '.env.local' });

import { typeOrmConfig } from './.loads/db.config';
import packageJson from '../../package.json';

console.table(Object.keys(process.env));

interface IPackageJson {
  name: string;
  version: string;
}
const typePackageJson = packageJson as unknown as IPackageJson;

export interface IConfig {
  port: number;
  database: typeof typeOrmConfig;
  app: {
    name: string;
    version: string;
  };
}

export default (): IConfig => ({
  port: parseInt(process.env.PORT || '8001', 10),
  database: typeOrmConfig,
  app: {
    name: typePackageJson.name,
    version: typePackageJson.version,
  },
});
