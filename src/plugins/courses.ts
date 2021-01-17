import Hapi from '@hapi/hapi';
import {
  createCourseHandler,
  getCourseHandler,
  deleteCourseHandler,
  updateCourseHandler,
  getAllCoursesHandler
} from '../controllers/courses';
import { courseInputValidator, idParamValidator } from '../validators/courses';
import { isTeacherOfCourseOrAdmin } from '../services/abilities';
import { API_AUTH_STRATEGY } from '../controllers/auth';

const coursesPlugin = {
  name: 'app/courses',
  dependencies: ['prisma'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/courses',
        handler: createCourseHandler,
        options: {
          validate: { payload: courseInputValidator.tailor('post') },
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'GET',
        path: '/courses/{courseId}',
        handler: getCourseHandler,
        options: {
          validate: { params: idParamValidator },
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'DELETE',
        path: '/courses/{courseId}',
        handler: deleteCourseHandler,
        options: {
          validate: { params: idParamValidator },
          pre: [isTeacherOfCourseOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'PUT',
        path: '/courses/{courseId}',
        handler: updateCourseHandler,
        options: {
          validate: {
            params: idParamValidator,
            payload: courseInputValidator.tailor('put')
          },
          pre: [isTeacherOfCourseOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'GET',
        path: '/courses',
        handler: getAllCoursesHandler,
        options: {
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      }
    ]);
  }
}

export default coursesPlugin;
