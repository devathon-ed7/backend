import { User_accounts, User_details } from "@prisma/client"
import { numberRequest, stringRequest } from "./request"
import { SortOder } from "./pagination"

export interface UserDetailsRequest {
  id: number
  description: string
  notes: string
  role_id: number
  email: string
  name: string
  user_account_id: number
  profile_filename: string
}

export interface UserDocument extends User_accounts {}
export type CreateUserType = Pick<User_accounts, "username" | "password">
export type UpdateUserType = Partial<User_accounts>

export interface UserModelInterface {
  getAll: (
    page: number,
    limit: number,
    sortBy: string,
    order: SortOder
  ) => Promise<Partial<UserDocument>[]>
  getById: (id: number) => Promise<UserDocument | null>
  create: (user: CreateUserType) => Promise<UserDocument>
  update: (user: UpdateUserType) => Promise<UserDocument>
  delete: (id: number) => Promise<UserDocument>
  getByUsername: (username: string) => Promise<UserDocument | null>
  count: () => Promise<number>
}

export interface userDetailsRequest {
  id: number
  description: stringRequest
  notes: stringRequest
  role_id: numberRequest
  email: stringRequest
  name: stringRequest
  user_account_id: numberRequest
  profile_filename: stringRequest
}

export interface UserDetailsDocument extends User_details {}
export type CreateUserDetailsType = Pick<
  User_details,
  | "description"
  | "notes"
  | "role_id"
  | "email"
  | "name"
  | "user_account_id"
  | "profile_filename"
>
export type UpdateUserDetailsType = Partial<User_details>

export interface DetailsModelInterface {
  getAll: () => Promise<User_details[]>
  getById: (id: number) => Promise<User_details | null>
  create: (data: CreateUserDetailsType) => Promise<User_details>
  update: (data: UpdateUserDetailsType) => Promise<User_details>
  delete: (id: number) => Promise<User_details>
}

export interface userRequest {
  id: numberRequest
  username: stringRequest
  password: stringRequest
  user_details: userDetailsRequest | null | undefined
}
