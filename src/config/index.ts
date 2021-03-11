import { ConfigModule } from '@nestjs/config';
import { checkConfigForDatabase } from './database';
import { checkConfigForJWT } from './jwt';
export { DATABASE_URL } from './database';
export { JWT_SECRET } from './jwt';
export const PRODUCTION = 'isProduction';

function checkIsProduction(config: Record<string, unknown>) {
  config.isProduction = config['NODE_ENV'] === 'production';
  return config;
}

function checkConfig(config: Record<string, unknown>) {
  checkConfigForDatabase(config);
  checkConfigForJWT(config);
  config = checkIsProduction(config);
  return config;
}

export function configurationModule() {
  return ConfigModule.forRoot({
    cache: true,
    validate: (config) => checkConfig(config),
  });
}
