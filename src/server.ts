import Hapi from '@hapi/hapi';

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost'
});

export const start = async (): Promise<Hapi.Server> => {
  await server.start();
  return server
}

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

start()
  .then(server => console.log(`Server is running on ${server.info.uri}`))
  .catch(err => console.error(err));
