import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { configurationModule, DATABASE_URL } from '../src/config';
import { createConnection } from 'typeorm';
import { allEntities } from '../src/utils';

export default async () => {
  const testingModule = await Test.createTestingModule({
    imports: [configurationModule()],
  }).compile();
  const configService = testingModule.get(ConfigService);
  const connection = await createConnection({
    type: 'postgres',
    url: configService.get(DATABASE_URL),
  });

  const databaseName = 'jfest_test_db';
  await connection.query(`DROP DATABASE IF EXISTS ${databaseName}`);
  await connection.query(`CREATE DATABASE ${databaseName}`);

  const templateDbConnection = await createConnection({
    name: 'templateConnection',
    type: 'postgres',
    url: configService
      .get<string>(DATABASE_URL)
      .replace(/\/[^/]+$/, '/' + databaseName),
    entities: allEntities,
    synchronize: true,
  });
  await templateDbConnection.close();

  const workers = parseInt(process.env.JEST_WORKERS || '1');
  for (let i = 1; i <= workers; i++) {
    const workerDatabaseName = `jfest_test_${i}`;

    await connection.query(`DROP DATABASE IF EXISTS ${workerDatabaseName};`);
    await connection.query(
      `CREATE DATABASE ${workerDatabaseName} TEMPLATE ${databaseName};`,
    );
  }
  await connection.close();
};
