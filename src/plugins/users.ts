import Hapi from '@hapi/hapi';
import { createUserHandler } from '../controllers/users';
import { userInputValidaor } from '../validators/users';

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
      }
    ]);
  }
}

export default usersPlugin;
