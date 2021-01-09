import Joi from 'joi';

export const testResultInputValidator = Joi.object({
  result: Joi.number().integer().min(0).max(1000).required(),
  studentId: Joi.number().alter({
    post: schema => schema.required(),
    put: schema => schema.forbidden()
  }),
  graderId: Joi.number().alter({
    post: schema => schema.required(),
    put: schema => schema.forbidden()
  })
});

export const testIdParamValidator = Joi.object({
  testId: Joi.number().integer()
});

export const userIdParamValidator = Joi.object({
  userId: Joi.number().integer()
});

export const testResultIdParamValidator = Joi.object({
  testResultId: Joi.number().integer()
});
