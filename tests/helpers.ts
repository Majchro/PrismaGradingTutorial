import * as Hapi from '@hapi/hapi';
import { UserRole } from '@prisma/client';
import { add } from 'date-fns';
import {
  TokenType,
  User,
  Token
} from '@prisma/client';
import '../types/modules';

export const createCourse = async (server: Hapi.Server) => {
  const course = await server.app.prisma.course.create({
    data: {
      name: 'Test course',
      courseDetails: 'Test description'
    }
  });

  if (!course) throw Error('TEST HELPER ERROR - createCourse');
  return course;
}

export const removeCourse = async (server: Hapi.Server, id: number) => {
  await server.app.prisma.test.deleteMany({ where: { courseId: id } });
  await server.app.prisma.courseEnrollment.deleteMany({ where: { courseId: id } });
  await server.app.prisma.course.delete({ where: { id } })
}

export const createUser = async (server: Hapi.Server, isAdmin: boolean) => {
  const user = await server.app.prisma.user.create({
    data: {
      email: `test-${Date.now()}@test.com`,
      isAdmin,
      tokens: {
        create: {
          expiration: add(new Date, { days: 7 }),
          type: TokenType.API
        }
      }
    },
    include: { tokens: true }
  });

  if (!user) throw Error('TEST HELPER ERROR - createUser');
  return user;
}

export const removeUser = async (server: Hapi.Server, id: number) => {
  await server.app.prisma.token.deleteMany({ where: { userId: id } });
  await server.app.prisma.testResult.deleteMany({ where: { studentId: id } });
  await server.app.prisma.user.delete({ where: { id } });
}

export const createTest = async (server: Hapi.Server, id: number) => {
  const test = await server.app.prisma.test.create({
    data: {
      name: 'Test name',
      date: Date.now().toString(),
      course: { connect: { id } }
    }
  });

  if (!test) throw Error('TEST HELPER ERROR - createTest');
  return test;
}

export const removeTest = async (server: Hapi.Server, id: number) => {
  await server.app.prisma.testResult.deleteMany({ where: { testId: id } });
  await server.app.prisma.test.delete({ where: { id } });
}

export const createUserEnrollment = async (server: Hapi.Server, userId: number, courseId: number, role: UserRole) => {
  await server.app.prisma.courseEnrollment.create({
    data: {
      user: { connect: { id: userId } },
      course: { connect: { id: courseId } },
      role
    }
  });
}

export const removeUserEnrollment = async (server: Hapi.Server, userId: number, courseId: number) => {
  await server.app.prisma.courseEnrollment.delete({
    where: { userId_courseId: { userId, courseId } }
  });
}

export const getUserCredentials = (user: User & { tokens: Array<Token> }, courses: Array<number> = []) => {
  return {
    userId: user.id,
    tokenId: user.tokens[0].id,
    isAdmin: user.isAdmin,
    teacherOf: courses
  }
}
