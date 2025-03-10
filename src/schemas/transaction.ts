import Joi from 'joi';

//schema for transaction
const idSchema =  Joi.number().integer().positive()
const productIdSchema =  Joi.number().integer().positive()
const quantitySchema =  Joi.number().integer().positive()
const codeSchema =  Joi.string().optional().min(1).max(100)
const transactionTypeSchema =  Joi.string().valid('in', 'out').required()

const transactionSchema = Joi.object({
  id: idSchema,
  product_id: productIdSchema,
  quantity: quantitySchema,
  code: codeSchema,
  transaction_type: transactionTypeSchema
})

const createTransactionSchema = Joi.object({
  transaction: transactionSchema
})

const updateTransactionSchema = createTransactionSchema

const getTransactionSchema = Joi.object({
  id: idSchema
})

const getByProductIdSchema = Joi.object({
  id: productIdSchema
})

const getByCodeSchema = Joi.object({
  code: codeSchema
})

const deleteTransactionSchema = getTransactionSchema

const transactionSchemas = {
  create: createTransactionSchema,
  update: updateTransactionSchema,
  get: getTransactionSchema,
  getByProductId: getByProductIdSchema,
  getByCode: getByCodeSchema,
  delete: deleteTransactionSchema
}

export default transactionSchemas;