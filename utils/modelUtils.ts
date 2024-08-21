import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const findMany = async (field: string, value: string) =>
  await prisma.category.findMany({
    where: {
      [field]: {
        contains: value
      }
    }
  })
