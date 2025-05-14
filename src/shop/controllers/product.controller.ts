import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { transformProduct } from '@Shop/services/transfomers/product.transformer';
import { ProductOutput } from '@Shop/types/product.output';
import { ProductConfigurationOutput } from '@Shop/types/product-configuration.output';
import { Public } from '@Auth/decorators/public.decorator';
import { ProductConfigurationQueryDto } from '@Shop/dtos/product-configuration-query-dto';
import { InventoryService } from '@Shop/services/inventory.service';
import { Roles } from '@Auth/decorators/roles.decorator';
import { UserRole } from '@User/entities/user-role';
import { OptionRulesService } from '@Shop/services/option-rules.service';
import { CreateProductDto } from '../dtos/create-product-dto';
import { ProductsService } from '../services/products.service';
import { UpdateProductDto } from '../dtos/update-product-dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly inventoryService: InventoryService,
    private readonly optionRulesService: OptionRulesService,
  ) {}

  @Public()
  @Get()
  async getAll(): Promise<ProductOutput[]> {
    const products = await this.productsService.getAll();

    return products.map((product) => transformProduct(product));
  }

  @Public()
  @Get(':productId')
  async getById(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductOutput> {
    const product = await this.productsService.getById(productId);

    const optionInventory =
      await this.inventoryService.getInventoryByProduct(productId);

    return transformProduct(product, optionInventory);
  }

  @Public()
  @Get(':productId/with-options')
  async getWithOptions(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query() query: ProductConfigurationQueryDto,
  ): Promise<ProductOutput> {
    const product = await this.productsService.getByIdAndOptions(
      productId,
      query.optionIds,
    );

    const optionInventory =
      await this.inventoryService.getInventoryByProduct(productId);

    const price = await this.productsService.calculateProductPrice(
      productId,
      query.optionIds,
    );

    const isValidConfiguration =
      await this.optionRulesService.validateConfiguration(
        productId,
        query.optionIds,
      );

    return transformProduct(
      product,
      optionInventory,
      isValidConfiguration,
      price,
    );
  }

  @Public()
  @Get(':productId/configuration')
  getConfiguration(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductConfigurationOutput> {
    return this.productsService.getProductConfiguration(productId);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() body: CreateProductDto): Promise<ProductOutput> {
    const product = await this.productsService.create(body);

    return transformProduct(product);
  }

  @Patch(':productId')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() body: UpdateProductDto,
  ): Promise<ProductOutput> {
    const product = await this.productsService.update(productId, body);

    return transformProduct(product);
  }

  @Delete(':productId')
  @Roles(UserRole.ADMIN)
  remove(@Param('productId', ParseUUIDPipe) productId: string): Promise<void> {
    return this.productsService.remove(productId);
  }
}
