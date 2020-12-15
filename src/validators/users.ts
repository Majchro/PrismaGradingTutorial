import Joi from 'joi';

export const userInputValidator = Joi.object({
  firstName: Joi.string().alter({
    post: schema => schema.required(),
    put: schema => schema.optional()
  }),
  lastName: Joi.string().alter({
    post: schema => schema.required(),
    put: schema => schema.optional()
  }),
  email: Joi.string().email().alter({
    post: schema => schema.required(),
    put: schema => schema.optional()
  }),
  social: Joi.object({
    facebook: Joi.string().optional(),
    twitter: Joi.string().optional(),
    github: Joi.string().optional(),
    website: Joi.string().optional()
  }).optional()
});

export const idParamValidator = Joi.object({
  userId: Joi.number().integer()
});
