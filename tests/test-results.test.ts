import { createServer } from '../src/server';
import * as Hapi from '@hapi/hapi';
import { API_AUTH_STRATEGY } from '../src/controllers/auth';
import {
  createCourse,
  createTest,
  removeCourse,
  removeTest,
  createUser,
  removeUser,
  createUserEnrollment,
  removeUserEnrollment,
  getUserCredentials
} from './helpers';

let testId: number;
let courseId: number;
let studentId: number;
let teacherId: number;
let testResultId: number;
let adminUserCredentials: Hapi.AuthCredentials;
let server: Hapi.Server;

beforeAll(async () => {
  server = await createServer();
  await createCourse(server).then(course => courseId = course.id);
  await createTest(server, courseId).then(test => testId = test.id);
  console.log('moze sie pokaze hehe')
  await createUser(server, false).then(user => studentId = user.id);
  await createUser(server, false).then(user => teacherId = user.id);
  await createUserEnrollment(server, studentId, courseId, 'STUDENT');
  await createUserEnrollment(server, teacherId, courseId, 'TEACHER');
  const adminUser = await createUser(server, true);
  adminUserCredentials = getUserCredentials(adminUser);
});
afterAll(async () => {
  await removeUserEnrollment(server, studentId, courseId)
  await removeUserEnrollment(server, teacherId, courseId)
  await removeTest(server, testId);
  await removeCourse(server, courseId);
  await removeUser(server, studentId);
  await removeUser(server, teacherId);
  await server.stop()
});

describe('POST /courses/tests/{testId}/test-results', () => {
  test('create test result', async () => {
    const response = await server.inject({
      method: 'POST',
      url: `/courses/tests/${testId}/test-results`,
      payload: {
        result: 950,
        studentId,
        graderId: teacherId
      },
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(201);
    const jsonResponse = JSON.parse(response.payload);
    testResultId = jsonResponse ? jsonResponse.id : null;
    expect(typeof testResultId === 'number').toBeTruthy();
  });

  test('create test result validation', async () => {
    const response = await server.inject({
      method: 'POST',
      url: `/courses/tests/${testId}/test-results`,
      payload: {
        result: 1001
      },
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /courses/tests/{testId}/test-results', () => {
  test('return test results for a specific test', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/courses/tests/${testId}/test-results`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(200);
    const jsonResponse = JSON.parse(response.payload);
    expect(jsonResponse[0].testId).toEqual(testId);
    expect(jsonResponse[0].result).toBeTruthy();
  });
});

describe('GET /users/{userId}/test-results', () => {
  test('return test results for a specific user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/${studentId}/test-results`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(200);
    const jsonResponse = JSON.parse(response.payload);
    expect(jsonResponse[0].testId).toEqual(testId);
    expect(jsonResponse[0].result).toEqual(950);
  });
});

describe('PUT /courses/tests/test-results/{testResultId}', () => {
  test('return 400 for invalid ID', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: '/courses/tests/test-results/9999',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(400);
  });

  test('update test result', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: `/courses/tests/test-results/${testResultId}`,
      payload: {
        result: 1000
      },
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(200);
    const jsonResponse = JSON.parse(response.payload);
    expect(typeof jsonResponse.id === 'number').toBeTruthy();
  });
});

describe('DELETE /courses/tests/test-results/{testResultId}', () => {
  test('return 400 for invalid ID', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/courses/tests/test-results/9999error',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(400);
  });

  test('delete test result', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/courses/tests/test-results/${testResultId}`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: adminUserCredentials
      }
    });
    expect(response.statusCode).toEqual(204);
  });
});
