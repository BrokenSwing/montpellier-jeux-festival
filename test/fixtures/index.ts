import { Connection, getRepository } from 'typeorm';
import { join } from 'path';
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_URL } from '../../src/config';
import { allEntities } from '../../src/utils';

export async function applyDataFixtures(connection: Connection, name: string) {
  await connection.synchronize(true);

  const loader = new Loader();
  loader.load(join(__dirname, name));

  const resolver = new Resolver();
  const fixtures = resolver.resolve(loader.fixtureConfigs);
  const builder = new Builder(connection, new Parser());

  for (const fixture of fixturesIterator(fixtures)) {
    const entity = await builder.build(fixture);
    await getRepository(entity.constructor.name).save(entity);
  }
}

export async function clearDatabase(connection: Connection) {
  const queryRunner = connection.createQueryRunner();

  await queryRunner.query(`
    DO
    $func$
    BEGIN
      EXECUTE (
        SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
          FROM pg_class
          WHERE relkind = 'r'
          AND relnamespace = 'public'::regnamespace
      );
    END
    $func$;
  `);
  await queryRunner.release();
}

export function testDatabaseAccess() {
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'postgres',
      url: config
        .get<string>(DATABASE_URL)
        .replace(/\/[^/]+$/, `/jfest_test_${process.env.JEST_WORKER_ID}`),
      entities: allEntities,
    }),
  });
}
