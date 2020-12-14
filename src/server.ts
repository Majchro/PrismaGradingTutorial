import Hapi from '@hapi/hapi';
import status from './plugins/status';

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost'
});

export const createServer = async (): Promise<Hapi.Server> => {
  await server.register([status]);
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
