import * as express from 'express';
import JWTToken from '../utils/JWTToken';

interface DecodedToken {

  scopes: string[];
  id?: string;
}
const jwtToken = new JWTToken();
export function expressAuthentication(request: express.Request, securityName: string): Promise<DecodedToken> {
  return new Promise((resolve, reject) => {
    if (securityName === "jwt") {
      const token =
        request.body.token ||
        request.query.token ||
        request.headers["x-access-token"];

      if (!token) {
        return reject(new Error("No token provided"));
      }

      const decodedToken = jwtToken.verify(token);
      return decodedToken

    } else {
      reject(new Error("Invalid security name"));
    }
  });
}