import Joi from "joi";

export const createProductSchema = Joi.object({
  _id: Joi.string().optional(),
  name: Joi.string().optional(),
  slug: Joi.string().optional(),
  image: Joi.string().optional(),
  price: Joi.number().greater(0).optional().messages({
    "number.greater": "Price must be a positive number",
    "any.optional": "Price is optional",
  }),
  category: Joi.string().optional(),
  brand: Joi.string().optional(),
  countInStock: Joi.number().optional(),
  description: Joi.string().optional(),
});

export const updateProductSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  slug: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().greater(0).required().messages({
    "number.greater": "Price must be a positive number",
  }),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  countInStock: Joi.number().required(),
  description: Joi.string().required(),
});
