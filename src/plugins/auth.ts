import Hapi from '@hapi/hapi';
// import { TokenType, UserRole } from '@prisma/client';
import {
  loginHandler,
  authenticateHandler,
  validateAPIToken,
  JWT_SECRET,
  JWT_ALGORITHM,
  API_AUTH_STRATEGY
} from '../controllers/auth';
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

    server.auth.strategy(API_AUTH_STRATEGY, 'jwt', {
      key: JWT_SECRET,
      verifyOptions: { algorithms: [JWT_ALGORITHM] },
      validate: validateAPIToken
    });

    server.auth.default(API_AUTH_STRATEGY)
  }
}

export default authPlugin;
