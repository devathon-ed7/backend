import {
  CategoryCreateType,
  CategoryDocument,
  CategoryPaginatedResponse,
  CategoryUpdateType,
  SortOrder
} from "../interfaces";
import boom from "@hapi/boom";
import {
  Get,
  Route,
  Tags,
  Response,
  Query,
  Security,
  Path,
  Body,
  Delete,
  Post,
  Put
} from "tsoa";
import { CategoryService } from "../services/category-service";

@Route("api/v1/categories")
@Tags("Category")
export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  @Get("/")
  @Response(200, "Success")
  @Security("jwt")
  public async getAll(
    @Query() page: number,
    @Query() limit: number,
    @Query() sortBy: string,
    @Query() order: SortOrder
  ): Promise<CategoryPaginatedResponse<CategoryDocument>> {
    const [categories, total] = await this.categoryService.getAll(
      page,
      limit,
      sortBy,
      order
    );

    const totalPages = Math.ceil(total / limit);

    return {
      categories,
      totalCategories: total,
      totalPages,
      currentPage: page,
      sort: {
        sortBy,
        order
      }
    };
  }

  @Get("{id}")
  @Response(200, "Success")
  @Response(404, "Category not found")
  @Security("jwt")
  public async getById(@Path() id: string): Promise<CategoryDocument | null> {
    const category = await this.categoryService.getById(id);

    if (!category) {
      throw boom.notFound("Category not found");
    }

    return category;
  }

  @Get("name/{name}")
  @Response(200, "Success")
  @Response(404, "Category not found")
  @Security("jwt")
  public async getByName(
    @Path() name: string
  ): Promise<CategoryDocument[] | null> {
    const category = await this.categoryService.getByName(name);

    if (!category) {
      throw boom.notFound("Category not found");
    }

    return category;
  }

  @Get("description/{description}")
  @Response(200, "Success")
  @Response(404, "Category not found")
  @Security("jwt")
  public async getByDescription(
    @Path() description: string
  ): Promise<CategoryDocument[] | null> {
    const category = await this.categoryService.getByDescription(description);

    if (!category) {
      throw boom.notFound("Category not found");
    }

    return category;
  }

  @Post("/")
  @Response(201, "Category created successfully")
  @Response(400, "All data is required")
  @Security("jwt")
  public async create(
    @Body() body: CategoryCreateType
  ): Promise<CategoryDocument> {
    if (!body || !body.name || !body.description) {
      throw boom.badRequest("All data is required");
    }

    const data: CategoryCreateType = {
      name: body.name,
      description: body.description
    };

    const newCategory = await this.categoryService.create(data);

    return newCategory;
  }

  @Delete("{id}")
  @Response(204, "Category deleted successfully")
  @Response(404, "Category not found")
  @Security("jwt")
  public async delete(@Path() id: string): Promise<void> {
    if (!id) {
      throw boom.unauthorized("Invalid category ID");
    }

    const category = await this.categoryService.getById(id);

    if (!category) {
      throw boom.notFound("Category not found");
    }

    await this.categoryService.delete(id);
  }

  @Put("{id}")
  @Response(200, "Category updated successfully")
  @Response(400, "All data is required")
  @Response(404, "Category not found")
  @Security("jwt")
  public async update(
    @Path() id: string,
    @Body() body: CategoryUpdateType
  ): Promise<CategoryDocument> {
    if (!id) {
      throw boom.unauthorized("Invalid category ID");
    }

    if (!body || !body.name || !body.description) {
      throw boom.badRequest("All data is required");
    }

    const category = await this.categoryService.getById(id);

    if (!category) {
      throw boom.notFound("Category not found");
    }

    const data: CategoryUpdateType = {
      name: body.name,
      description: body.description,
      id: id
    };

    const updatedCategory = await this.categoryService.update(id, data);

    return updatedCategory;
  }
}
