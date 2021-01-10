import Hapi from '@hapi/hapi';
import { sendEmailToken } from '../services/mailer';

declare module '@hapi/hapi' {
  interface ServerApplicationState {
    sendEmailToken(email: string, token: string): Promise<void>
  }
}

const emailPlugin = {
  name: 'app/email',
  register: async (server: Hapi.Server) => {
    server.app.sendEmailToken = sendEmailToken
  }
}

export default emailPlugin;
