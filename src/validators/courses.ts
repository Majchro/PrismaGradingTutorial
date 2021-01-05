import Joi from 'joi';

export const courseInputValidator = Joi.object({
  name: Joi.string().alter({
    post: schema => schema.required(),
    put: schema => schema.optional()
  }),
  courseDetails: Joi.string().optional()
});

export const idParamValidator = Joi.object({
  courseId: Joi.number().integer()
});
