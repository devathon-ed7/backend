import { UserDocumentWithoutPassword } from "./user-model-interface";

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignUpResponse {
  token: string;
}

export interface SignInResponse {
  user: UserDocumentWithoutPassword;
  token: string;
}
