import boom from "@hapi/boom"

export const findMany = async <T>(
  model: {
    findMany: (args: {
      where: { [key: string]: { contains: string } }
    }) => Promise<T[]>
  },
  field: string,
  value: string
): Promise<T[]> =>
  await model.findMany({
    where: {
      [field]: {
        contains: value
      } as { contains: string }
    }
  })

export const checkIfExists = async <T>(
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
