// src/utils/custom-request.d.ts
import { UserDocument } from "../interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      token?: string | null;
    }
  }
}
