import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { TestInput } from '../../types/api';

export const createTestHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as TestInput;
  const courseId = parseInt(request.params.courseId, 10);
  try {
    const createdTest = await prisma.test.create({
      data: {
        name: payload.name,
        date: payload.date,
        course: { connect: { id: courseId } }
      },
      select: { id: true }
    });
    return h.response(createdTest).code(201);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
};

export const getTestHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const testId = parseInt(request.params.testId, 10);
  try {
    const test = await prisma.test.findUnique({ where: { id: testId } });
    if (!test) return h.response().code(404);
    return h.response(test).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
};

export const deleteTestHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const testId = parseInt(request.params.testId, 10);
  try {
    await prisma.test.delete({ where: { id: testId } });
    return h.response().code(204);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
};

export const updateTestHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const testId = parseInt(request.params.testId, 10);
  const payload = request.payload as Partial<TestInput>
  try {
    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: payload
    });
    return h.response(updatedTest).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
};
