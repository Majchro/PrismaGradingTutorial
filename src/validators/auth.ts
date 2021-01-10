import Joi from 'joi';

export const loginValidator = Joi.object({
  email: Joi.string().email().required()
});
