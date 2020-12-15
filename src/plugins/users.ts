import Hapi from '@hapi/hapi';
import { createUserHandler, getUserHandler } from '../controllers/users';
import { userInputValidaor, getParams } from '../validators/users';

const usersPlugin = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/users',
        handler: createUserHandler,
        options: { validate: { payload: userInputValidaor } }
      },
      {
        method: 'GET',
        path: '/users/{userId}',
        handler: getUserHandler,
        options: { validate: { params: getParams } }
      }
    ]);
  }
}

export default usersPlugin;
