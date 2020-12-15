import Hapi from '@hapi/hapi';
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
  }
}
