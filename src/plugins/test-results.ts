import Hapi from '@hapi/hapi';
import {
  createTestResultHandler,
  getTestResultsHandler,
  getUserTestResultsHandler,
  deleteTestResultHandler,
  updateTestResultHandler
} from '../controllers/test-results';
import {
  testResultInputValidator,
  testIdParamValidator,
  userIdParamValidator,
  testResultIdParamValidator
} from '../validators/test-results';
import {
  isRequestedUserOrAdmin,
  isTeacherOfTestOrAdmin,
  isGraderOfTestResultOrAdmin
} from '../services/abilities';
import { API_AUTH_STRATEGY } from '../controllers/auth';

const testResultsPlugin = {
  name: 'app/testResults',
  dependencies: ['prisma'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/courses/tests/{testId}/test-results',
        handler: createTestResultHandler,
        options: {
          validate: {
            params: testIdParamValidator,
            payload: testResultInputValidator.tailor('post')
          },
          pre: [isTeacherOfTestOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'GET',
        path: '/courses/tests/{testId}/test-results',
        handler: getTestResultsHandler,
        options: {
          validate: { params: testIdParamValidator },
          pre: [isTeacherOfTestOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'GET',
        path: '/users/{userId}/test-results',
        handler: getUserTestResultsHandler,
        options: {
          validate: { params: userIdParamValidator },
          pre: [isRequestedUserOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'DELETE',
        path: '/courses/tests/test-results/{testResultId}',
        handler: deleteTestResultHandler,
        options: {
          validate: { params: testResultIdParamValidator },
          pre: [isGraderOfTestResultOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'PUT',
        path: '/courses/tests/test-results/{testResultId}',
        handler: updateTestResultHandler,
        options: {
          validate: {
            params: testResultIdParamValidator,
            payload: testResultInputValidator.tailor('put')
          },
          pre: [isGraderOfTestResultOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      }
    ]);
  }
}

export default testResultsPlugin;
