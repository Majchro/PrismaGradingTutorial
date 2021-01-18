import { createServer } from '../src/server';
import * as Hapi from '@hapi/hapi';
import { API_AUTH_STRATEGY } from '../src/controllers/auth';
import {
  createUser,
  getUserCredentials,
  removeUser
} from './helpers';

let courseId: number;
let adminUserCredentials: Hapi.AuthCredentials;
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

describe('POST /courses', () => {
  test('create course', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/courses',
      payload: {
        name: 'Test name',
        courseDetails: 'Test description'
      },
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(201);
    const jsonResponse = JSON.parse(response.payload);
    courseId = jsonResponse ? jsonResponse.id : null;
    expect(typeof courseId === 'number').toBeTruthy();
  });

  test('create course validation', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/courses',
      payload: {},
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /courses/{courseId}', () => {
  test('return 404 for non existance course', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/courses/9999',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(404);
  });

  test('return course', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/courses/${courseId}`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(200);
    const course = JSON.parse(response.payload);
    expect(course.id).toBe(courseId);
  });
});

describe('GET /courses', () => {
  test('return all courses', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/courses',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(200);
    const courses = JSON.parse(response.payload);
    expect(Array.isArray(courses)).toBeTruthy();
  });
});

describe('PUT /courses/{courseId}', () => {
  test('return 400 for invalid ID', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: '/courses/9999error',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(400);
  });

  test('update course', async () => {
    const updatedValue: String = 'Updated name';

    const response = await server.inject({
      method: 'PUT',
      url: `/courses/${courseId}`,
      payload: {
        name: updatedValue,
      },
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(200);
    const course = JSON.parse(response.payload);
    expect(course.name).toEqual(updatedValue);
  });
});

describe('DELETE /courses/{courseId}', () => {
  test('return 400 for invalid ID', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/courses/9999error',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(400);
  });

  test('delete course', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/courses/${courseId}`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(204);
  });
});
