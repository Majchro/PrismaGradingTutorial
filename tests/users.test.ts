import * as Hapi from '@hapi/hapi';
import { createServer } from '../src/server';
import { API_AUTH_STRATEGY } from '../src/controllers/auth';
import {
  createUser,
  getUserCredentials,
  removeUser
} from './helpers';

let adminUserCredentials: Hapi.AuthCredentials;
let userId: number;
let server: Hapi.Server;

beforeAll(async () => {
  server = await createServer()
  const adminUser = await createUser(server, true);
  adminUserCredentials = getUserCredentials(adminUser);
});
afterAll(async () => {
  await removeUser(server, adminUserCredentials.userId)
  await server.stop();
});

describe('POST /users', () => {
  test('create user', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@test.pl'
      },
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(201);
    const jsonResponse = JSON.parse(response.payload);
    userId = jsonResponse ? jsonResponse.id : null;
    expect(typeof userId === 'number').toBeTruthy();
  });

  test('create user validation', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        lastName: 'Test',
        social: {
          twitter: 'test-twitter',
          website: 'test.pl'
        }
      },
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /users/{userId}', () => {
  test('return 404 for non existance user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/users/9999',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(404);
  });

  test('return user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/${userId}`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(200);
    const user = JSON.parse(response.payload);
    expect(user.id).toBe(userId);
  });
});

describe('GET /users', () => {
  test('return all users', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/users',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(200);
    const users = JSON.parse(response.payload);
    expect(Array.isArray(users)).toBeTruthy();
  });
});

describe('PUT /users/{userId}', () => {
  test('return 400 for invalid ID', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: '/users/9999error',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(400);
  });

  test('update user', async () => {
    const updatedValue: String = 'UpdatedTest';

    const response = await server.inject({
      method: 'PUT',
      url: `/users/${userId}`,
      payload: {
        firstName: updatedValue,
        lastName: updatedValue
      },
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(200);
    const user = JSON.parse(response.payload);
    expect(user.firstName).toEqual(updatedValue);
    expect(user.lastName).toEqual(updatedValue);
  });
});

describe('DELETE /users/{userId}', () => {
  test('delete user', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${userId}`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(204);
  });
});
