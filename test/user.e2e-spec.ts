import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, Repository } from 'typeorm';
import {
  applyDataFixtures,
  testDatabaseAccess,
  clearDatabase,
} from './fixtures';
import { PasswordService } from '../src/user/password.service';
import { PlainPasswordService } from './mock/password.service';
import { UserModule } from '../src/user/user.module';
import { JWT_SECRET } from '../src/config';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { User } from '../src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [testDatabaseAccess(), UserModule],
    })
      .overrideProvider(PasswordService)
      .useClass(PlainPasswordService)
      .overrideProvider(JWT_SECRET)
      .useValue('secret')
      .compile();

    connection = moduleFixture.get(Connection);
    userRepository = moduleFixture.get(getRepositoryToken(User));

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await applyDataFixtures(connection, 'user');
  });

  afterEach(async () => {
    await clearDatabase(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  const adminToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZTZlMDQzZS05MWJkLTRhMmQtOWFiZC0xMjE3NzM2Y2E0MGIiLCJ1c2VybmFtZSI6IkxpbGlhbiJ9.cp5jykewtuE4YpeEpdzQ5QNBwKKfBgf8wJrrX2A40u0';
  const basicToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC1hYWFhLWJiYmItY2NjYy0xMjE3NzM2Y2E0MGIiLCJ1c2VybmFtZSI6IkF4ZWwifQ.szA7czm8RaYa4IEF9JWghJOXbjhVKShyeOZvqZdR00c';

  describe('/api/user (POST)', () => {
    const endpoint = '/api/user';

    const correctBody: CreateUserDto = {
      username: 'Florent',
      password: 'my-password',
      isAdmin: true,
    };

    it('should create the user if the authenticated user is admin', async () => {
      let id: string;
      await request(app.getHttpServer())
        .post(endpoint)
        .send(correctBody)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body).toHaveProperty('username', 'Florent');
          expect(body).toHaveProperty('isAdmin', true);
          expect(body).toHaveProperty('id', expect.any(String));
          id = body.id;
        });
      const user = await userRepository.findOne(id);
      expect(user).toBeTruthy();
    });

    it('should return a BadRequest status if the username already exist', () => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send({
          ...correctBody,
          username: 'Lilian',
        })
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return forbidden status if the authenticated user is not admin', () => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send(correctBody)
        .auth(basicToken, { type: 'bearer' })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return unauthorized status if the user is not authenticated', () => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send(correctBody)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/api/user (GET)', () => {
    const endpoint = '/api/user';

    it('should list all users if authenticated user is admin', () => {
      return request(app.getHttpServer())
        .get(endpoint)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toHaveLength(2);
        });
    });

    it('should return forbidden status if authenticated user is not admin', () => {
      return request(app.getHttpServer())
        .get(endpoint)
        .auth(basicToken, { type: 'bearer' })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return unauthorized status if user is not authenticated', () => {
      return request(app.getHttpServer())
        .get(endpoint)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/api/user (PATCH)', () => {
    const endpoint = '/api/user/ae6e043e-91bd-4a2d-9abd-1217736ca40b';

    it('should return bad rquest exception if new username is already used', () => {
      return request(app.getHttpServer())
        .patch(endpoint)
        .auth(adminToken, { type: 'bearer' })
        .send({
          username: 'Axel',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
