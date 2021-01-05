import Hapi from '@hapi/hapi';
import {
  createCourseHandler,
  getCourseHandler,
  deleteCourseHandler,
  updateCourseHandler,
  getAllCoursesHandler
} from '../controllers/courses';
import { courseInputValidator, idParamValidator } from '../validators/courses';

const coursesPlugin = {
  name: 'app/courses',
  dependencies: ['prisma'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/courses',
        handler: createCourseHandler,
        options: { validate: { payload: courseInputValidator.tailor('post') } }
      },
      {
        method: 'GET',
        path: '/courses/{courseId}',
        handler: getCourseHandler,
        options: { validate: { params: idParamValidator } }
      },
      {
        method: 'DELETE',
        path: '/courses/{courseId}',
        handler: deleteCourseHandler,
        options: { validate: { params: idParamValidator } }
      },
      {
        method: 'PUT',
        path: '/courses/{courseId}',
        handler: updateCourseHandler,
        options: {
          validate: {
            params: idParamValidator,
            payload: courseInputValidator.tailor('put')
          }
        }
      },
      {
        method: 'GET',
        path: '/courses',
        handler: getAllCoursesHandler
      }
    ]);
  }
}

export default coursesPlugin;
