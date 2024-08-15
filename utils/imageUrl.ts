import { type Request } from "express"

const getFilesUrl = (
  request: Request,
  files: Express.Multer.File[]
): string[] => {
  return files.map((file) => {
    return `${request.protocol}://${request.get("host")}/imgs/${file.filename}`
  })
}

const getFileUrl = (request: Request, file: Express.Multer.File): string => {
  return `${request.protocol}://${request.get("host")}/imgs/${file.filename}`
}

export { getFilesUrl, getFileUrl }
