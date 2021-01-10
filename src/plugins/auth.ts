import Hapi from '@hapi/hapi';
// import { TokenType, UserRole } from '@prisma/client';
import { loginHandler, authenticateHandler } from '../controllers/auth';
import { loginValidator, authenticateValidator } from '../validators/auth';

const authPlugin: Hapi.Plugin<null> = {
  name: 'app/auth',
  dependencies: ['prisma', 'hapi-auth-jwt2', 'app/email'],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/login',
        handler: loginHandler,
        options: {
          auth: false,
          validate: { payload: loginValidator }
        }
      },
      {
        method: 'POST',
        path: '/authenticate',
        handler: authenticateHandler,
        options: {
          auth: false,
          validate: {
            payload: authenticateValidator
          }
        }
      }
    ]);
  }
}

export default authPlugin;
