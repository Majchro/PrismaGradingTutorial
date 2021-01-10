import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { TokenType } from '@prisma/client';
import { LoginInput } from '../../types/api';

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;

export const loginHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma, sendEmailToken } = request.server.app;
  const { email } = request.payload as LoginInput;
  const emailToken = uuidv4();
  const tokenExpiration = add(new Date(), { minutes: EMAIL_TOKEN_EXPIRATION_MINUTES });
  try {
    await prisma.token.create({
      data: {
        emailToken,
        type: TokenType.EMAIL,
        expiration: tokenExpiration,
        user: {
          connectOrCreate: {
            create: { email },
            where: { email }
          }
        }
      }
    });
    await sendEmailToken(email, emailToken);
    return h.response().code(200);
  } catch (err) {
    return Boom.badImplementation(err.message);
  }
}
