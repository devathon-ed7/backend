import { type Request } from "express"

const getFileUrl = (request: Request, file: Express.Multer.File): string => {
  return `${request.protocol}://${request.get("host")}/imgs/${file.filename}`
}

export default getFileUrl
