import { NextFunction, Request, Response } from "express"
import boom from "@hapi/boom"

export const deleteEntity = async (
  req: Request,
  res: Response,
  next: NextFunction,
  model: {
    getById: (id: number) => Promise<unknown>
    delete: (id: number) => Promise<unknown>
  },
  entityName: string
) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      throw boom.badRequest("Invalid ID")
    }

    const entity = await model.getById(id)
    if (!entity) {
      throw boom.notFound(`${entityName} not found`)
    }

    await model.delete(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export const getAllEntities = async (
  req: Request,
  res: Response,
  next: NextFunction,
  model: { getAll: () => Promise<unknown[]> },
  entityName: string
) => {
  try {
    const entities = await model.getAll()
    res.status(200).json({ [entityName]: entities })
  } catch (error) {
    next(error)
  }
}

export const validateParam = (
  req: Request,
  paramName: string,
  paramType: "string" | "number" = "string"
) => {
  const param = req.params[paramName]

  if (paramType === "number") {
    const id = parseInt(param)
    if (isNaN(id)) {
      throw boom.badRequest(`Invalid ${paramName} ID`)
    }
    return id
  }

  if (!param) {
    throw boom.badRequest(`Missing ${paramName}`)
  }

  return param
}

export const getByStringParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
  modelMethod: (param: string) => Promise<unknown>,
  entityName: string,
  paramName: string
) => {
  try {
    const param = validateParam(req, paramName)
    const result = await modelMethod(param as string)

    if (!result) {
      throw boom.notFound(`${entityName} not found`)
    }

    res.status(200).json({ result })
  } catch (error) {
    next(error)
  }
}

export const getByNumberParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
  modelMethod: (param: number) => Promise<unknown>,
  entityName: string,
  paramName: string,
  paramType: "number"
) => {
  try {
    const param = validateParam(req, paramName, paramType)
    const result = await modelMethod(param as number)

    if (!result) {
      throw boom.notFound(`${entityName} not found`)
    }

    res.status(200).json({ result })
  } catch (error) {
    next(error)
  }
}
