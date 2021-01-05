import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { CourseInput } from '../../types/api';

export const createCourseHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as CourseInput;
  try {
    const createdCourse = await prisma.course.create({
      data: {
        name: payload.name,
        courseDetails: payload.courseDetails
      },
      select: { id: true }
    });
    return h.response(createdCourse).code(201);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
};

export const getCourseHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const courseId = parseInt(request.params.courseId, 10);
  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return h.response().code(404);
    return h.response(course).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
};

export const deleteCourseHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const courseId = parseInt(request.params.courseId, 10);
  try {
    await prisma.course.delete({ where: { id: courseId } });
    return h.response().code(204);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
};

export const updateCourseHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const courseId = parseInt(request.params.courseId, 10);
  const payload = request.payload as Partial<CourseInput>
  try {
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: payload
    })
    return h.response(updatedCourse).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
};

export const getAllCoursesHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  try {
    const courses = await prisma.course.findMany();
    if (!courses) return h.response().code(404);
    return h.response(courses).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
};
