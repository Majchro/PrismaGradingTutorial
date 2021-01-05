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
    return h.response(createdUser).code(201);
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

export const deleteUserHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId, 10);
  try {
    await prisma.user.delete({ where: { id: userId } });
    return h.response().code(204);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}

export const updateUserHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId, 10);
  const payload = request.payload as Partial<UserInput>
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: payload
    })
    return h.response(updatedUser).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}

export const getAllUsersHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  try {
    const users = await prisma.user.findMany();
    if (!users) return h.response().code(404);
    return h.response(users).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}
