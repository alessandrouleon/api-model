
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({

    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user (POST)', () => {
    return request(app.getHttpServer())
      .post('/')
      .expect(200)
      .expect('Hello World!');
  });
});
