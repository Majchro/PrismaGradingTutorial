import Hapi from '@hapi/hapi';

const plugin: Hapi.Plugin<undefined> = {
  name: 'app/status',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'GET',
      path: '/',
      handler: (_, h: Hapi.ResponseToolkit) => h.response({ up: true }).code(200),
      options: { auth: false }
    });
  }
}

export default plugin;
