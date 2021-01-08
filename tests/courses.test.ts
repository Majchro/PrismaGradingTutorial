import { createServer } from '../src/server';
import * as Hapi from '@hapi/hapi';

let courseId: number;
let server: Hapi.Server;

beforeAll(async () => server = await createServer());
afterAll(async () => await server.stop());

describe('POST /courses', () => {
  test('create course', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/courses',
      payload: {
        name: 'Test name',
        courseDetails: 'Test description'
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
      payload: {}
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /courses/{courseId}', () => {
  test('return 404 for non existance course', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/courses/9999'
    });
    expect(response.statusCode).toEqual(404);
  });

  test('return course', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/courses/${courseId}`
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
      url: '/courses'
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
      url: '/courses/9999error'
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
      url: '/courses/9999error'
    });
    expect(response.statusCode).toEqual(400);
  });

  test('delete course', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/courses/${courseId}`
    });
    expect(response.statusCode).toEqual(204);
  });
});
