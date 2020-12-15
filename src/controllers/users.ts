import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { UserInput } from '../../types/api';

export const createUserHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as UserInput;
  try {
    const createdUser = await prisma.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        social: JSON.stringify(payload.social)
      },
      select: { id: true }
    });
    return h.response(createdUser).code(201)
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}

export const getUserHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId, 10);
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return h.response().code(404);
    return h.response(user).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}
