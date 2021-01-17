import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export const isRequestedUserOrAdmin = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { userId, isAdmin } = request.auth.credentials;
  if (isAdmin) return h.continue;

  const requestedUserId = parseInt(request.params.userId, 10);
  if (requestedUserId === userId) return h.continue;

  throw Boom.forbidden();
}

export const isTeacherOfCourseOrAdmin = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { isAdmin, teacherOf } = request.auth.credentials;
  if (isAdmin) return h.continue;

  const courseId = parseInt(request.params.courseId, 10);
  if (teacherOf?.includes(courseId)) return h.continue;

  throw Boom.forbidden();
}

export const isGraderOfTestResultOrAdmin = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { userId, isAdmin, teacherOf } = request.auth.credentials;
  if (isAdmin) return h.continue;

  const testResultId = parseInt(request.params.testResultId, 10);
  const { prisma } = request.server.app;
  const testResult = await prisma.testResult.findUnique({
    where: { id: testResultId }
  });

  if (testResult?.graderId === userId) return h.continue;

  throw Boom.forbidden();
}

export const isAdmin = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  if (request.auth.credentials.isAdmin) return h.continue;

  throw Boom.forbidden();
}

export const isTeacherOfTestOrAdmin = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { isAdmin, teacherOf } = request.auth.credentials;
  if (isAdmin) return h.continue;

  const testId = parseInt(request.params.testId, 10);
  const { prisma } = request.server.app;
  const test = await prisma.test.findUnique({
    where: { id: testId },
    select: { course: { select: { id: true } } }
  });

  if (test?.course.id && teacherOf.includes(test?.course.id)) return h.continue;

  throw Boom.forbidden();
}
