import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface Payload {
  [key: string]: string | number | boolean;
}
interface IToken {
  generate(payload: Payload): string;
  verify(token: string): Promise<Payload>;
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

  verify(token: string): Promise<Payload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          reject(new Error("Invalid token"));
        } else {
          resolve(decoded as Payload);
        }
      });
    });
  }
}

export default JWTToken;
