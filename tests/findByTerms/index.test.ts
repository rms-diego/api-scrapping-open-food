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
    const response = await request.get(`${baseUrl}?nutrition=z&nova=1`);
    const data = response.body.at(0);

    expect(response.statusCode).toBe(400);
    expect(data).toEqual({
      validation: 'regex',
      code: 'invalid_string',
      message: 'Invalid',
      path: ['nutrition'],
    });
  });

  test('It should be thrown error if fetch a product passing wrong nova', async () => {
    const response = await request.get(`${baseUrl}?nutrition=a&nova=1000`);
    const data = response.body.at(0);

    expect(response.statusCode).toBe(400);
    expect(data).toEqual({
      code: 'too_big',
      maximum: 4,
      type: 'number',
      inclusive: true,
      exact: false,
      message: 'Number must be less than or equal to 4',
      path: ['nova'],
    });
  });
});
