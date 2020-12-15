import { createServer } from '../src/server';
import Hapi from '@hapi/hapi';

describe('POST /users', () => {
  let server: Hapi.Server;

  beforeAll(async () => server = await createServer());
  afterAll(async () => await server.stop());

  let userId: number;

  test('create user', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@test.pl',
        social: {
          twitter: 'test-twitter',
          website: 'test.pl'
        }
      }
    });
    expect(response.statusCode).toEqual(201);
    userId = JSON.parse(response.payload)?.id;
    expect(typeof userId === 'number').toBeTruthy();
  });

  test('create user validation', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        lastName: 'Test',
        email: 'test@test.pl',
        social: {
          twitter: 'test-twitter',
          website: 'test.pl'
        }
      }
    });
    expect(response.statusCode).toEqual(400);
  });
});
