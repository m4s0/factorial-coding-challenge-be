import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from '@Auth/decorators/public.decorator';
import { Roles } from '@Auth/decorators/roles.decorator';
import { UserRole } from '@User/entities/user-role';
import { ProductCategoryOutput } from '@Shop/types/product-category.output';
import { CreateProductCategoryDto } from '@Shop/dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from '@Shop/dtos/update-product-category.dto';
import { ProductCategoriesService } from '@Shop/services/product-categories.service';
import { transformProductCategory } from '@Shop/services/transfomers/product-category.transformer';

@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Public()
  @Get()
  async getAll(): Promise<ProductCategoryOutput[]> {
    const categories = await this.productCategoriesService.getAll();

    return categories.map((category) => transformProductCategory(category));
  }

  @Public()
  @Get(':categoryId')
  async getById(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<ProductCategoryOutput> {
    const category = await this.productCategoriesService.getById(categoryId);

    return transformProductCategory(category);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: CreateProductCategoryDto,
  ): Promise<ProductCategoryOutput> {
    const category = await this.productCategoriesService.create(body);

    return transformProductCategory(category);
  }

  @Patch(':categoryId')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() body: UpdateProductCategoryDto,
  ): Promise<ProductCategoryOutput> {
    const category = await this.productCategoriesService.update(
      categoryId,
      body,
    );

    return transformProductCategory(category);
  }

  @Delete(':categoryId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<void> {
    return this.productCategoriesService.remove(categoryId);
  }
}
