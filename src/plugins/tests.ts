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
import { isTeacherOfTestOrAdmin } from '../services/abilities';
import { API_AUTH_STRATEGY } from '../controllers/auth';

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
          },
          pre: [isTeacherOfTestOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'GET',
        path: '/courses/tests/{testId}',
        handler: getTestHandler,
        options: {
          validate: { params: idParamValidator },
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'DELETE',
        path: '/courses/tests/{testId}',
        handler: deleteTestHandler,
        options: {
          validate: { params: idParamValidator },
          pre: [isTeacherOfTestOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'PUT',
        path: '/courses/tests/{testId}',
        handler: updateTestHandler,
        options: {
          validate: {
            params: idParamValidator,
            payload: testInputValidator.tailor('put')
          },
          pre: [isTeacherOfTestOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      }
    ]);
  }
}

export default testsPlugin;
