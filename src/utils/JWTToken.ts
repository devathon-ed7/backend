import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface Payload {
  [key: string]: string | number | boolean;
}

export interface DecodedToken {
  id?: string;
}
interface IToken {
  generate(payload: Payload): string;
  verify(token: string): Promise<DecodedToken>;
}
class JWTToken implements IToken {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY as string;
  }

  generate(payload: Payload): string {
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verify(token: string): Promise<DecodedToken> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          reject(new Error("Invalid token"));
        } else {
          resolve(decoded as DecodedToken);
        }
      });
    });
  }
}

export default JWTToken;
