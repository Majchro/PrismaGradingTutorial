import Hapi from '@hapi/hapi';
import {
  createUserHandler,
  getUserHandler,
  deleteUserHandler,
  updateUserHandler,
  getAllUsersHandler
} from '../controllers/users';
import { userInputValidator, idParamValidator } from '../validators/users';
import { isRequestedUserOrAdmin, isAdmin } from '../services/abilities';
import { API_AUTH_STRATEGY } from '../controllers/auth';

const usersPlugin = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/users',
        handler: createUserHandler,
        options: {
          validate: { payload: userInputValidator.tailor('post') },
          pre: [isAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'GET',
        path: '/users/{userId}',
        handler: getUserHandler,
        options: {
          validate: { params: idParamValidator },
          pre: [isRequestedUserOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'DELETE',
        path: '/users/{userId}',
        handler: deleteUserHandler,
        options: {
          validate: { params: idParamValidator },
          pre: [isRequestedUserOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'PUT',
        path: '/users/{userId}',
        handler: updateUserHandler,
        options: {
          validate: {
            params: idParamValidator,
            payload: userInputValidator.tailor('put')
          },
          pre: [isRequestedUserOrAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      },
      {
        method: 'GET',
        path: '/users',
        handler: getAllUsersHandler,
        options: {
          pre: [isAdmin],
          auth: { mode: 'required', strategy: API_AUTH_STRATEGY }
        }
      }
    ]);
  }
}

export default usersPlugin;
