import { UserDocument } from "../models/mariadb/user.ts"

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument
      token?: string | null
    }
  }
}
