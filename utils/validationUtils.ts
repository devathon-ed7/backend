import boom from "@hapi/boom"

export const validateEntityId = async <T>(
  model: { getById: (id: number) => Promise<T | null> },
  id: number,
  entityName: string
): Promise<T> => {
  const entity = await model.getById(id)
  if (!entity) {
    throw boom.notFound(`${entityName} not found`)
  }
  return entity
}
