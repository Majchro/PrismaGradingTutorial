import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { TestResultInput } from '../../types/api';

export const createTestResultHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as TestResultInput;
  const testId = parseInt(request.params.testId, 10);
  try {
    const createdTestResult = await prisma.testResult.create({
      data: {
        result: payload.result,
        student: { connect: { id: payload.studentId } },
        gradedBy: { connect: { id: payload.graderId } },
        test: { connect: { id: testId } }
      }
    });
    return h.response(createdTestResult).code(201);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}

export const getTestResultsHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const testId = parseInt(request.params.testId, 10);
  try {
    const testResults = await prisma.testResult.findMany({ where: { testId } });
    if (!testResults) return h.response().code(404);
    return h.response(testResults).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}

export const getUserTestResultsHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const studentId = parseInt(request.params.userId, 10);
  try {
    const testResults = await prisma.testResult.findMany({ where: { studentId } });
    if (!testResults) return h.response().code(404);
    return h.response(testResults).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}

export const deleteTestResultHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const testResultId = parseInt(request.params.testResultId, 10);
  try {
    await prisma.testResult.delete({ where: { id: testResultId } });
    return h.response().code(204);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}

export const updateTestResultHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const testResultId = parseInt(request.params.testResultId, 10);
  const payload = request.payload as Pick<TestResultInput, 'result'>
  try {
    const updatedTestResult = await prisma.testResult.update({
      where: { id: testResultId },
      data: { result: payload.result }
    })
    return h.response(updatedTestResult).code(200);
  } catch (err) {
    console.error(err);
    return Boom.badImplementation();
  }
}
