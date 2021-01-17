import Hapi from '@hapi/hapi';
import {
  createUserEnrollmentHandler,
  getUserEnrollmentHandler,
  deleteUserEnrollmentHandler,
} from '../controllers/users-enrollment';
import {
  userInputValidator,
  userIdParamValidator,
  userCourseIdsParamValidator
} from '../validators/users-enrollment';
import { isRequestedUserOrAdmin } from '../services/abilities';
import { API_AUTH_STRATEGY } from '../controllers/auth';

const usersEnrollmentPlugin = {
  name: 'app/usersEnrollment',
  dependencies: ['prisma'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/users/{userId}/courses',
        handler: createUserEnrollmentHandler,
        options: {
          validate: {
            params: userIdParamValidator,
            payload: userInputValidator
          },
          pre: [isRequestedUserOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'GET',
        path: '/users/{userId}/courses',
        handler: getUserEnrollmentHandler,
        options: {
          validate: { params: userIdParamValidator },
          pre: [isRequestedUserOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'DELETE',
        path: '/users/{userId}/courses/{courseId}',
        handler: deleteUserEnrollmentHandler,
        options: {
          validate: { params: userCourseIdsParamValidator },
          pre: [isRequestedUserOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      }
    ]);
  }
}

export default usersEnrollmentPlugin;
