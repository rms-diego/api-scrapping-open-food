import { describe, expect, test } from 'vitest';
import supertest from 'supertest';

import { app } from '@/app';

describe('[GET] /products - Tests cases to findByTerm', () => {
  const request = supertest(app);
  const baseUrl = '/products';

  test('It should be able fetch a products passing correct queries params', async () => {
    const response = await request.get(`${baseUrl}?page=1&nutrition=a&nova=1`);
    const data = response.body;

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      const firstProduct = data.at(0);

      expect(firstProduct.id).toBeDefined();
      expect(firstProduct.name).toBeDefined();

      expect(firstProduct.nutrition).toBeDefined();
      expect(firstProduct.nutrition.score).toBeDefined();
      expect(firstProduct.nutrition.title).toBeDefined();

      expect(firstProduct.nova).toBeDefined();
      expect(firstProduct.nova.score).toBeDefined();
      expect(firstProduct.nova.title).toBeDefined();
    }
  });

  test('It should be thrown error if fetch a product passing wrong nutrition', async () => {
    const wrongNutrition = 'z';
    const response = await request.get(`${baseUrl}?nutrition=${wrongNutrition}&nova=1`);
    const data = response.body;

    expect(response.statusCode).toBe(400);
    expect(data).toEqual({
      issues: [
        {
          message: "wrong nutrition, only accept 'A', 'B', 'C', 'D', 'E'",
          path: ['nutrition'],
        },
      ],
    });
  });

  test('It should be thrown error if fetch a product passing 1000 on nova', async () => {
    const wrongNova = 1000;
    const response = await request.get(`${baseUrl}?nutrition=a&nova=${wrongNova}`);
    const data = response.body;

    expect(response.statusCode).toBe(400);
    expect(data).toEqual({
      issues: [
        {
          message: 'max nova is 4',
          path: ['nova'],
        },
      ],
    });
  });

  test('It should be thrown error if fetch a product passing -1000 on nova', async () => {
    const wrongNova = -1000;
    const response = await request.get(`${baseUrl}?nutrition=a&nova=${wrongNova}`);
    const data = response.body;

    expect(response.statusCode).toBe(400);
    expect(data).toEqual({
      issues: [
        {
          message: 'min nova is 1',
          path: ['nova'],
        },
      ],
    });
  });
});
