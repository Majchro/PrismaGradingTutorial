import { createServer } from '../src/server';
import Hapi from '@hapi/hapi';

let testId: number;
let server: Hapi.Server;

beforeAll(async () => server = await createServer());
afterAll(async () => await server.stop());

describe('POST /courses/{courseId}/tests', () => {
  test('create test', async () => {
    const courseId = await createCourseId();
    const response = await server.inject({
      method: 'POST',
      url: `/courses/${courseId}/tests`,
      payload: {
        name: 'Test name',
        date: Date.now()
      }
    });
    expect(response.statusCode).toEqual(201);
    testId = JSON.parse(response.payload)?.id;
    expect(typeof testId === 'number').toBeTruthy();
  });

  test('create test validation', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/courses/1/tests',
      payload: {}
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /courses/tests/{testId}', () => {
  test('return 404 for non existance test', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/courses/tests/9999'
    });
    expect(response.statusCode).toEqual(404);
  });

  test('return test', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/courses/tests/${testId}`
    });
    expect(response.statusCode).toEqual(200);
    const course = JSON.parse(response.payload);
    expect(course.id).toBe(testId);
  });
});

describe('PUT /courses/tests/{testId}', () => {
  test('return 400 for invalid ID', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: '/courses/tests/9999error'
    });
    expect(response.statusCode).toEqual(400);
  });

  test('update test', async () => {
    const updatedValue: String = 'Updated name';

    const response = await server.inject({
      method: 'PUT',
      url: `/courses/tests/${testId}`,
      payload: {
        name: updatedValue,
      }
    });
    expect(response.statusCode).toEqual(200);
    const course = JSON.parse(response.payload);
    expect(course.name).toEqual(updatedValue);
  });
});

describe('DELETE /courses/tests/{testId}', () => {
  test('return 400 for invalid ID', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/courses/tests/9999error'
    });
    expect(response.statusCode).toEqual(400);
  });

  test('delete test', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/courses/tests/${testId}`
    });
    expect(response.statusCode).toEqual(204);
  });
});

const createCourseId = async () => {
  const response = await server.inject({
    method: 'POST',
    url: '/courses',
    payload: {
      name: 'Test name',
      courseDetails: 'Test description'
    }
  });
  return JSON.parse(response.payload)?.id;
}
