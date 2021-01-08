import { createServer } from '../src/server';
import * as Hapi from '@hapi/hapi';
import {
  createUserId,
  removeUser,
  createCourseId,
  removeCourse
} from './helpers';

let studentId: number;
let teacherId: number;
let courseId: number;
let server: Hapi.Server;

beforeAll(async () => {
  server = await createServer();
  studentId = await createUserId(server, 'student@test.pl');
  teacherId = await createUserId(server, 'teacher@test.pl');
  courseId = await createCourseId(server);
});
afterAll(async () => {
  await removeUser(server, studentId);
  await removeUser(server, teacherId);
  await removeCourse(server, courseId);
  await server.stop();
});

describe('POST /users/{userId}/courses', () => {
  test('add user as student to course', async () => {
    const response = await server.inject({
      method: 'POST',
      url: `/users/${studentId}/courses`,
      payload: {
        courseId,
        role: 'STUDENT'
      }
    });
    expect(response.statusCode).toEqual(201);
    const jsonResponse = JSON.parse(response.payload);
    expect(jsonResponse.role).toEqual('STUDENT');
    expect(jsonResponse.userId).toEqual(studentId);
    expect(jsonResponse.courseId).toEqual(courseId);
  });

  test('add user as teacher to course', async () => {
    const response = await server.inject({
      method: 'POST',
      url: `/users/${teacherId}/courses`,
      payload: {
        courseId,
        role: 'TEACHER'
      }
    });
    expect(response.statusCode).toEqual(201);
    const jsonResponse = JSON.parse(response.payload);
    expect(jsonResponse.role).toEqual('TEACHER');
    expect(jsonResponse.userId).toEqual(teacherId);
    expect(jsonResponse.courseId).toEqual(courseId);
  });

  test('add user to course validation', async () => {
    const response = await server.inject({
      method: 'POST',
      url: `/users/${studentId}/courses`,
      payload: {
        courseId,
        role: 'NONE'
      }
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('GET /users/{userId}/courses', () => {
  test('return user courses', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/${studentId}/courses`
    });
    expect(response.statusCode).toEqual(200);
    const userCourses = JSON.parse(response.payload);
    expect(userCourses[0].id).toEqual(courseId);
  });
});

describe('DELETE /users/{userId}/courses/{courseId}	', () => {
  test('return 400 for invalid course ID', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${studentId}/courses/99999error`
    });
    expect(response.statusCode).toEqual(400);
  });

  test('delete user enrollment in course', async () => {
    await server.inject({
      method: 'DELETE',
      url: `/users/${teacherId}/courses/${courseId}`
    });
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${studentId}/courses/${courseId}`
    });
    expect(response.statusCode).toEqual(204);
  });
});
