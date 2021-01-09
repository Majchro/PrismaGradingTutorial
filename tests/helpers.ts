import * as Hapi from '@hapi/hapi';
import { UserRole } from '@prisma/client';

export const createCourseId = async (server: Hapi.Server) => {
  const response = await server.inject({
    method: 'POST',
    url: '/courses',
    payload: {
      name: 'Test name',
      courseDetails: 'Test description'
    }
  });
  const jsonResponse = JSON.parse(response.payload);
  return jsonResponse ? jsonResponse.id : null;
}

export const removeCourse = async (server: Hapi.Server, id: number) => {
  await server.inject({
    method: 'DELETE',
    url: `/courses/${id}`
  });
}

export const createUserId = async (server: Hapi.Server, email: string) => {
  const response = await server.inject({
    method: 'POST',
    url: '/users',
    payload: {
      firstName: 'Test',
      lastName: 'Test',
      email
    }
  });
  const jsonResponse = JSON.parse(response.payload);
  return jsonResponse ? jsonResponse.id : null;
}

export const removeUser = async (server: Hapi.Server, id: number) => {
  await server.inject({
    method: 'DELETE',
    url: `/users/${id}`
  });
}

export const createTestId = async (server: Hapi.Server, id: number) => {
  const response = await server.inject({
    method: 'POST',
    url: `/courses/${id}/tests`,
    payload: {
      name: 'Test name',
      date: Date.now()
    }
  });
  const jsonResponse = JSON.parse(response.payload);
  return jsonResponse ? jsonResponse.id : null;
}

export const removeTest = async (server: Hapi.Server, id: number) => {
  await server.inject({
    method: 'DELETE',
    url: `/courses/tests/${id}`
  });
}

export const createUserEnrollment = async (server: Hapi.Server, userId: number, courseId: number, role: UserRole) => {
  await server.inject({
    method: 'POST',
    url: `/users/${userId}/courses`,
    payload: { courseId, role }
  })
}

export const removeUserEnrollment = async (server: Hapi.Server, userId: number, courseId: number) => {
  await server.inject({
    method: 'DELETE',
    url: `/users/${userId}/courses/${courseId}`
  });
}
