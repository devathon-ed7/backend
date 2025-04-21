import boom from "@hapi/boom";
import { Response, Route, Tags, Get, Path, Post, Body, Delete, Put, Query, Security } from "tsoa";

import { hashPassword } from "../utils/password-utils";
import { UserPaginatedResponse, SortOrder, UserCreateType, UserDocument, UserDocumentWithoutPassword, UserUpdateType } from "../interfaces";
import { UserService } from "../services/user-service";



@Route('api/v1/users')
@Tags('User')

export class UserController {


  private userService: UserService;

  constructor() {
    this.userService = new UserService;
  }

  @Get('/')
  @Response(200, 'Success')
  @Security('jwt')
  public async getAll(
    @Query() page: number,
    @Query() limit: number,
    @Query() sortBy: string,
    @Query() order: SortOrder
  ): Promise<UserPaginatedResponse<UserDocumentWithoutPassword>> {

    const [users, totalUsers] = await this.userService.getAll(page, limit, sortBy, order as SortOrder);

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users,
      totalUsers,
      totalPages,
      currentPage: page,
      sort: {
        sortBy,
        order
      }
    };

  };

  @Get('{id}')
  @Response(200, 'Success')
  @Response(404, 'User not found')
  @Security('jwt')
  public async getById(
    @Path() id: string
  ): Promise<UserDocumentWithoutPassword | null> {

    const existingUser = await this.userService.getById(id);

    if (!existingUser) {
      throw boom.notFound("User not found");
    }

    return existingUser
  };

  @Post('/')
  @Response(201, 'User created successfully')
  @Response(409, 'User already exists')
  @Security('jwt')
  public async create(
    @Body() user: UserCreateType
  ): Promise<UserDocument> {


    if (user && user.email && user.password && user.name) {
      const emailExists = await this.userService.emailExists(user.email);
      if (emailExists) {
        throw boom.conflict("User could not be created");
      }
      const hashedPassword = await hashPassword(user.password);

      const createdUser = await this.userService.create({
        email: user.email,
        password: hashedPassword,
        name: user.name
      });

      if (!createdUser) {
        throw boom.badImplementation("User could not be created");
      }
      return createdUser
    } else {
      throw boom.badImplementation("User could not be created");
    }

  };

  @Delete('{id}')
  @Response(204, 'User deleted successfully')
  @Response(404, 'User not found')
  @Security('jwt')
  public async delete(@Path() id: string): Promise<void> {

    if (!id) {
      throw boom.badRequest("Invalid ID")
    }

    const existingUser = await this.userService.getById(id)
    if (!existingUser) {
      throw boom.notFound(`User not found`)
    }

    await this.userService.delete(id)

  }

  @Put('{id}')
  @Response(200, 'User updated successfully')
  @Response(404, 'User not found')
  @Security('jwt')
  public async update(
    @Path() id: string,
    @Body() user: UserUpdateType
  ): Promise<UserDocument> {

    const existingUser = await this.userService.getById(id);
    if (!existingUser) {
      throw boom.notFound("User not found");
    }
    return this.userService.update(id, user);

  };


}
