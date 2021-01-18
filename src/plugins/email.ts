import Hapi from '@hapi/hapi';
import { sendEmailToken } from '../services/mailer';

const emailPlugin = {
  name: 'app/email',
  register: async (server: Hapi.Server) => {
    server.app.sendEmailToken = sendEmailToken
  }
}

export default emailPlugin;
