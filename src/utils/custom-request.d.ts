// src/utils/custom-request.d.ts
import { UserDocumentWithoutPassword } from "../interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocumentWithoutPassword | null;
      token?: string | null;
    }
  }
}
