import Hapi from '@hapi/hapi';
import hapiAuthJWT from 'hapi-auth-jwt2';
import status from './plugins/status';
import prisma from './plugins/prisma';
import users from './plugins/users';
import courses from './plugins/courses';
import tests from './plugins/tests';
import usersEnrollment from './plugins/users-enrollment';
import testResults from './plugins/test-results';
import email from './plugins/email';
import auth from './plugins/auth';

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost'
});

export const createServer = async (): Promise<Hapi.Server> => {
  await server.register([
    status,
    prisma,
    hapiAuthJWT,
    auth,
    email,
    users,
    courses,
    tests,
    usersEnrollment,
    testResults
  ]);
  await server.initialize();
  return server;
}

export const startServer = async (server: Hapi.Server): Promise<Hapi.Server> => {
  await server.start();
  console.log(`Server is running on ${server.info.uri}`)
  return server;
}

export const start = async (): Promise<Hapi.Server> => {
  await server.register([status]);
  await server.start();
  return server;
}

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});
