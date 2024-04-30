import { IConfig } from './config.types';
import * as configs from './config';
import dotenv from 'dotenv';
dotenv.config({ path: `../../../.env` });

export class Config {
  public config: IConfig = {};

  constructor() {
    let config: IConfig = configs.defaultConfig;

    const env = process.env['NODE_ENV'] || 'development';
    if (Object.keys(configs).includes(env))
      config = {
        ...config,
        ...configs[env as keyof typeof configs],
      };
    this.config = config;
  }

  public get(key: string) {
    return this.config[key as keyof typeof this.config];
  }
}
