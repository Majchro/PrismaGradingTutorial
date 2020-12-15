import { createServer } from '../src/server';
import Hapi from '@hapi/hapi';

let userId: number;
let server: Hapi.Server;

beforeAll(async () => server = await createServer());
afterAll(async () => await server.stop());

describe('POST /users', () => {
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

describe('GET /users/{userId}', () => {
  test('return 404 for non existance user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/users/9999'
    });
    expect(response.statusCode).toEqual(404);
  });

  test('return user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/${userId}`
    });
    expect(response.statusCode).toEqual(200);
    const user = JSON.parse(response.payload);
    expect(user.id).toBe(userId);
  })
})
