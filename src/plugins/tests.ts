import Hapi from '@hapi/hapi';
import {
  createTestHandler,
  getTestHandler,
  deleteTestHandler,
  updateTestHandler
} from '../controllers/tests';
import {
  testInputValidator,
  idParamValidator,
  courseIdParamValidator
} from '../validators/tests';

const testsPlugin = {
  name: 'app/tests',
  dependencies: ['prisma'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/courses/{courseId}/tests',
        handler: createTestHandler,
        options: {
          validate: {
            params: courseIdParamValidator,
            payload: testInputValidator.tailor('post')
          }
        }
      },
      {
        method: 'GET',
        path: '/courses/tests/{testId}',
        handler: getTestHandler,
        options: { validate: { params: idParamValidator } }
      },
      {
        method: 'DELETE',
        path: '/courses/tests/{testId}',
        handler: deleteTestHandler,
        options: { validate: { params: idParamValidator } }
      },
      {
        method: 'PUT',
        path: '/courses/tests/{testId}',
        handler: updateTestHandler,
        options: {
          validate: {
            params: idParamValidator,
            payload: testInputValidator.tailor('put')
          }
        }
      }
    ]);
  }
}

export default testsPlugin;
