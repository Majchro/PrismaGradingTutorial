import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { UserEnrollmentInput } from '../../types/api';

export const createUserEnrollmentHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId, 10);
  const payload = request.payload as UserEnrollmentInput;
  try {
    const userCourses = await prisma.courseEnrollment.create({
      data: {
        user: { connect: { id: userId } },
        course: { connect: { id: payload.courseId } },
        role: payload.role
      }
    });
    return h.response(userCourses).code(201);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}

export const getUserEnrollmentHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId, 10);
  try {
    const userCourses = await prisma.course.findMany({
      where: { users: { some: { userId } } }
    });
    return h.response(userCourses).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}

export const deleteUserEnrollmentHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId, 10);
  const courseId = parseInt(request.params.courseId, 10);
  try {
    await prisma.courseEnrollment.delete({
      where: { userId_courseId: { userId, courseId } }
    });
    return h.response().code(204);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}
