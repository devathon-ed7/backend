import Joi from "joi";

const id = Joi.string().optional();
const name = Joi.string().required().max(255).messages({
  "string.empty": "Name is not allowed to be empty",
  "any.required": "Name is required"
});
const description = Joi.string().optional().allow(null, "").messages({
  "string.base": "Description is not allowed to be empty"
});
const parentCategoryId = Joi.string().optional().allow(null);
const created_at = Joi.date().optional();
const updated_at = Joi.date().optional();

const baseCategorySchema = Joi.object({
  id,
  name,
  description,
  parentCategoryId,
  created_at,
  updated_at
});

const createSchema = baseCategorySchema.fork(["name"], (schema) =>
  schema.required()
);
const updateSchema = baseCategorySchema.keys({
  id: id.required()
});

//operation schema

const createCategorySchema = createSchema;

const updateCategorySchema = updateSchema;

const getCategorySchema = Joi.object({
  id: id.required()
});

const deleteCategorySchema = getCategorySchema;

export const categorySchemas = {
  create: createCategorySchema,
  update: updateCategorySchema,
  get: getCategorySchema,
  delete: deleteCategorySchema
};

export default categorySchemas;
