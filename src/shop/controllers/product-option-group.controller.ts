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
import { Public } from '@Auth/decorators/public.decorator';
import { Roles } from '@Auth/decorators/roles.decorator';
import { UserRole } from '@User/entities/user-role';
import { ProductOptionGroupsService } from '@Shop/services/product-option-groups.service';
import { ProductOptionGroupOutput } from '@Shop/types/product-option-group.output';
import { UpdateProductOptionGroupDto } from '@Shop/dtos/update-product-option-group.dto';
import { transformProductOptionGroup } from '@Shop/services/transfomers/product-option-group.transformer';
import { CreateProductOptionGroupDto } from '../dtos/create-product-option-group-dto';

@Controller('product-option-groups')
export class ProductOptionGroupController {
  constructor(
    private readonly productOptionGroupsService: ProductOptionGroupsService,
  ) {}

  @Get(':optionId')
  async getById(
    @Param('optionId', ParseUUIDPipe) optionId: string,
  ): Promise<ProductOptionGroupOutput> {
    const productOptionGroup =
      await this.productOptionGroupsService.getById(optionId);

    return transformProductOptionGroup(productOptionGroup);
  }

  @Get()
  async getAll(): Promise<ProductOptionGroupOutput[]> {
    const productOptionGroups = await this.productOptionGroupsService.getAll();

    return productOptionGroups.map((productOptionGroup) =>
      transformProductOptionGroup(productOptionGroup),
    );
  }

  @Public()
  @Get('product/:productId')
  async findByProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductOptionGroupOutput[]> {
    const productOptionGroups =
      await this.productOptionGroupsService.findOptionGroupsByProductId(
        productId,
      );

    return productOptionGroups.map((productOptionGroup) =>
      transformProductOptionGroup(productOptionGroup),
    );
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: CreateProductOptionGroupDto,
  ): Promise<ProductOptionGroupOutput> {
    const productOptionGroup =
      await this.productOptionGroupsService.create(body);

    return transformProductOptionGroup(productOptionGroup);
  }

  @Patch(':optionId')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('optionId', ParseUUIDPipe) optionId: string,
    @Body() body: UpdateProductOptionGroupDto,
  ): Promise<ProductOptionGroupOutput> {
    const productOptionGroup = await this.productOptionGroupsService.update(
      optionId,
      body,
    );

    return transformProductOptionGroup(productOptionGroup);
  }

  @Delete(':optionId')
  @Roles(UserRole.ADMIN)
  remove(@Param('optionId') optionId: string): Promise<void> {
    return this.productOptionGroupsService.remove(optionId);
  }
}
