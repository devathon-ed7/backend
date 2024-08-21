import { NextFunction, Request, Response } from "express"
import boom from "@hapi/boom"

export const deleteEntity = async (
  req: Request,
  res: Response,
  next: NextFunction,
  getById: (id: number) => Promise<unknown>,
  deleteById: (id: number) => Promise<void>,
  entityName: string
) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      throw boom.badRequest("Invalid ID")
    }

    const entity = await getById(id)
    if (!entity) {
      throw boom.notFound(`${entityName} not found`)
    }

    await deleteById(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
