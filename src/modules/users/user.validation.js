import Joi from "joi";

export const signUpSchema = {
  body: Joi.object({
    fName: Joi.string().alphanum().min(2).max(10).required(),
    lName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    cPassword: Joi.string().valid(Joi.ref("password")),
    gender: Joi.string().valid("male", "female"),
    phone: Joi.string().required(),

    age: Joi.number().required().min(18).max(60).integer().positive(),
  })
    .required()
    .messages({
      "any.required": "body is empty",
    }),
};

export const signIpSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
};
