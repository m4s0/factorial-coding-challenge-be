import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { transformProductOption } from '@Shop/services/transfomers/product-option.transform';
import { Roles } from '@Auth/decorators/roles.decorator';
import { UserRole } from '@User/entities/user-role';
import { ProductOptionOutput } from '@Shop/types/product-option.output';
import { ProductOptionsService } from '../services/product-options.service';
import { CreateProductOptionDto } from '../dtos/create-product-option.dto';
import { UpdateProductOptionDto } from '../dtos/update-product-option.dto';

@Controller('product-options')
export class ProductOptionController {
  constructor(private readonly productOptionsService: ProductOptionsService) {}

  @Get()
  async getAll(): Promise<ProductOptionOutput[]> {
    const productOptions = await this.productOptionsService.getAll();

    return productOptions.map((productOption) =>
      transformProductOption(productOption),
    );
  }

  @Get(':optionId')
  async getById(
    @Param('optionId', ParseUUIDPipe) optionId: string,
  ): Promise<ProductOptionOutput> {
    const productOption = await this.productOptionsService.getById(optionId);

    return transformProductOption(productOption);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: CreateProductOptionDto,
  ): Promise<ProductOptionOutput> {
    const productOption = await this.productOptionsService.create(body);

    return transformProductOption(productOption);
  }

  @Patch(':optionId')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('optionId', ParseUUIDPipe) optionId: string,
    @Body() body: UpdateProductOptionDto,
  ): Promise<ProductOptionOutput> {
    const productOption = await this.productOptionsService.update(
      optionId,
      body,
    );

    return transformProductOption(productOption);
  }

  @Delete(':optionId')
  @Roles(UserRole.ADMIN)
  remove(@Param('optionId') optionId: string): Promise<void> {
    return this.productOptionsService.remove(optionId);
  }
}
