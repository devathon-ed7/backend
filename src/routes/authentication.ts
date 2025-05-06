import * as express from "express";
import JWTToken from "../utils/JWTToken";

interface DecodedToken {
  id?: string;
}

const jwtToken = new JWTToken();

export async function expressAuthentication(
  request: express.Request,
  securityName: string
): Promise<DecodedToken> {
  return new Promise((resolve, reject) => {
    if (securityName === "jwt") {
      const token =
        request.body.token ||
        request.query.token ||
        request.headers["x-access-token"];

      if (!token) {
        return reject(new Error("No token provided"));
      }

      try {
        const decoded = jwtToken.verify(token) as DecodedToken;
        resolve(decoded);
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error("Invalid security name"));
    }
  });
}
