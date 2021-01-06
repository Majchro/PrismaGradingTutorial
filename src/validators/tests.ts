import Joi from 'joi';

export const testInputValidator = Joi.object({
  name: Joi.string().alter({
    post: schema => schema.required(),
    put: schema => schema.optional()
  }),
  date: Joi.date().alter({
    post: schema => schema.required(),
    put: schema => schema.optional()
  })
});

export const idParamValidator = Joi.object({
  testId: Joi.number().integer()
});

export const courseIdParamValidator = Joi.object({
  courseId: Joi.number().integer()
});
