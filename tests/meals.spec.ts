import {
  afterAll,
  beforeAll,
  describe,
  it,
  beforeEach,
  expect,
} from 'vitest';

import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all');
    execSync('npm run knex -- migrate:latest');
  });


  it('should be able to create a new meal', async () => {

    const createUserResponse = await request(app.server).post('/users').send({
      email: 'test@example.com',
      name: 'Test'
    });

    const cookies = createUserResponse.get('Set-Cookie');
    const mealData = {
      name: 'Almoço',
      description: 'Arroz, feijão e salada',
      isOnDiet: false,
    };

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(mealData)
      .expect(201);

  });

  it('should be able to get a meal summary', async () => {

    const createUserResponse = await request(app.server).post('/users').send({
      email: 'test@example.com',
      name: 'Test',
    });

    const cookies = createUserResponse.get('Set-Cookie');

    const response = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        totalMealsRecorded: expect.any(Number),
        totalMealsWithinDiet: expect.any(Number),
        totalMealsOutsideDiet: expect.any(Number),
        bestSequenceOfMealsWithinDiet: expect.any(Array),
      })
    );
  });
});
