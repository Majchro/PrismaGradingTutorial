import * as Hapi from '@hapi/hapi';

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
      email,
      social: {
        twitter: 'test-twitter',
        website: 'test.pl'
      }
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
