import Joi from 'joi';

export const loginValidator = Joi.object({
  email: Joi.string().email().required()
});

export const authenticateValidator = Joi.object({
  email: Joi.string().email().required(),
  emailToken: Joi.string().required()
})

export const apiTokenSchema = Joi.object({
  tokenId: Joi.number().integer().required()
})
