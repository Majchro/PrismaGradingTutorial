import Hapi from '@hapi/hapi';
import {
  createUserHandler,
  getUserHandler,
  deleteUserHandler,
  updateUserHandler
} from '../controllers/users';
import { userInputValidator, idParamValidator } from '../validators/users';

const usersPlugin = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/users',
        handler: createUserHandler,
        options: { validate: { payload: userInputValidator.tailor('post') } }
      },
      {
        method: 'GET',
        path: '/users/{userId}',
        handler: getUserHandler,
        options: { validate: { params: idParamValidator } }
      },
      {
        method: 'DELETE',
        path: '/users/{userId}',
        handler: deleteUserHandler,
        options: { validate: { params: idParamValidator } }
      },
      {
        method: 'PUT',
        path: '/users/{userId}',
        handler: updateUserHandler,
        options: {
          validate: {
            params: idParamValidator,
            payload: userInputValidator.tailor('put')
          }
        }
      }
    ]);
  }
}

export default usersPlugin;
