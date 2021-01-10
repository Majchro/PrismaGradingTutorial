import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { TokenType } from '@prisma/client';
import { LoginInput, AuthenticateInput } from '../../types/api';

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';
const JWT_ALGORITHM = 'HS256';
const AUTHENTICATION_TOKEN_EXPIRATION_HOURS = 12;

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

export const authenticateHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { email, emailToken } = request.payload as AuthenticateInput;
  try {
    const fetchedEmailToken = await prisma.token.findUnique({
      where: { emailToken },
      include: { user: true }
    });
    if (!fetchedEmailToken) return Boom.unauthorized();
    if (!fetchedEmailToken.valid) return Boom.unauthorized();
    if (fetchedEmailToken.expiration < new Date()) return Boom.unauthorized('Token expired');
    if (fetchedEmailToken.user.email !== email) return Boom.unauthorized();

    const tokenExpiration = add(new Date(), { hours: AUTHENTICATION_TOKEN_EXPIRATION_HOURS });
    const createdToken = await prisma.token.create({
      data: {
        type: TokenType.API,
        expiration: tokenExpiration,
        user: { connect: { email } }
      }
    });

    await prisma.token.update({
      where: { id: fetchedEmailToken.id },
      data: { valid: false }
    });

    const authToken = generateAuthToken(createdToken.id);
    return h.response().code(200).header('Authorization', authToken);
  } catch (err) {
    return Boom.badImplementation(err.message);
  }
}

const generateAuthToken = (tokenId: number): string => {
  const jwtPayload = { tokenId };
  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    noTimestamp: true
  });
}
