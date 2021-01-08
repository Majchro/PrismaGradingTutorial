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
          }
        }
      },
      {
        method: 'GET',
        path: '/users/{userId}/courses',
        handler: getUserEnrollmentHandler,
        options: { validate: { params: userIdParamValidator } }
      },
      {
        method: 'DELETE',
        path: '/users/{userId}/courses/{courseId}',
        handler: deleteUserEnrollmentHandler,
        options: { validate: { params: userCourseIdsParamValidator } }
      }
    ]);
  }
}

export default usersEnrollmentPlugin;
