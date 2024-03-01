import { describe, expect, test } from 'vitest';
import supertest from 'supertest';

import { app } from '@/app';

import { successResponseBodyFindProductById } from '../mocks';

describe('[GET] /products/:productId - Tests cases to findByProductId', () => {
  const request = supertest(app);
  const baseUrl = '/products';

  test('It should be thrown error if fetch a product passing wrong product id', async () => {
    const response = await request.get(`${baseUrl}/78986786600144736487268476`);
    const data = response.body;

    expect(response.statusCode).toBe(404);
    expect(data).toEqual({ message: 'product not found' });
  });

  test('It should be able fetch a product passing correct product id', async () => {
    const response = await request.get(`${baseUrl}/7898678660014`);
    const data = response.body;

    expect(response.statusCode).toBe(200);
    expect(data).toEqual(successResponseBodyFindProductById);
  });
});
