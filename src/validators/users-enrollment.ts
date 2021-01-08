import Joi from 'joi';
import { UserRole } from '@prisma/client';

export const userInputValidator = Joi.object({
  courseId: Joi.number().required(),
  role: Joi.string().valid(...Object.values(UserRole))
});

export const userIdParamValidator = Joi.object({
  userId: Joi.number().integer()
});

export const userCourseIdsParamValidator = Joi.object({
  userId: Joi.number().integer(),
  courseId: Joi.number().integer()
});
