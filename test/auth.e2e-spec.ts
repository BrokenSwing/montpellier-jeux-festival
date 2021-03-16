import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import {
  applyDataFixtures,
  testDatabaseAccess,
  clearDatabase,
} from './fixtures';
import { AuthModule } from '../src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [testDatabaseAccess(), AuthModule],
    }).compile();

    connection = moduleFixture.get(Connection);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await applyDataFixtures(connection, 'auth');
  });

  afterEach(async () => {
    await clearDatabase(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    const endpoint = '/auth/login';

    it('Correct credentials', () => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send({
          username: 'florent',
          password: 'my-password',
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token', expect.any(String));
        });
    });

    it('Incorrect credentials', async () => {
      // Invalid password ONLY
      await request(app.getHttpServer())
        .post(endpoint)
        .send({
          username: 'florent',
          password: 'azerty',
        })
        .expect(HttpStatus.UNAUTHORIZED);
      // Invalid username ONLY
      await request(app.getHttpServer())
        .post(endpoint)
        .send({
          username: 'flo',
          password: 'my-password',
        })
        .expect(HttpStatus.UNAUTHORIZED);
      // Invalid username AND password
      await request(app.getHttpServer())
        .post(endpoint)
        .send({
          username: 'flo',
          password: 'password',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
