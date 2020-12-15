import Joi from 'joi';

export const userInputValidaor = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  social: Joi.object({
    facebook: Joi.string().optional(),
    twitter: Joi.string().optional(),
    github: Joi.string().optional(),
    website: Joi.string().optional()
  }).optional()
});
