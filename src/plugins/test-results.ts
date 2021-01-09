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
          }
        }
      },
      {
        method: 'GET',
        path: '/courses/tests/{testId}/test-results',
        handler: getTestResultsHandler,
        options: { validate: { params: testIdParamValidator } }
      },
      {
        method: 'GET',
        path: '/users/{userId}/test-results',
        handler: getUserTestResultsHandler,
        options: { validate: { params: userIdParamValidator } }
      },
      {
        method: 'DELETE',
        path: '/courses/tests/test-results/{testResultId}',
        handler: deleteTestResultHandler,
        options: { validate: { params: testResultIdParamValidator } }
      },
      {
        method: 'PUT',
        path: '/courses/tests/test-results/{testResultId}',
        handler: updateTestResultHandler,
        options: {
          validate: {
            params: testResultIdParamValidator,
            payload: testResultInputValidator.tailor('put')
          }
        }
      }
    ]);
  }
}

export default testResultsPlugin;
