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
import { InventoryItemOutput } from '@Shop/types/inventory-item.output';
import { transformInventoryItem } from '@Shop/services/transfomers/inventory-item.transformer';
import { CreateInventoryItemDto } from '@Shop/dtos/create-inventory-item-dto';
import { UpdateInventoryItemDto } from '@Shop/dtos/update-inventory-item-dto';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getAll(): Promise<InventoryItemOutput[]> {
    const inventoryItemItems = await this.inventoryService.getAll();

    return inventoryItemItems.map((inventoryItemItem) =>
      transformInventoryItem(inventoryItemItem),
    );
  }

  @Get(':inventoryItemId')
  async getById(
    @Param('inventoryItemId', ParseUUIDPipe) inventoryItemId: string,
  ): Promise<InventoryItemOutput> {
    const inventoryItemItem =
      await this.inventoryService.getById(inventoryItemId);

    return transformInventoryItem(inventoryItemItem);
  }

  @Public()
  @Get('product/:productId')
  async getByProductId(@Param('productId', ParseUUIDPipe) productId: string) {
    const inventoryItem =
      await this.inventoryService.getInventoryByProduct(productId);

    return transformInventoryItem(inventoryItem);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: CreateInventoryItemDto,
  ): Promise<InventoryItemOutput> {
    const inventoryItem = await this.inventoryService.create(body);

    return transformInventoryItem(inventoryItem);
  }

  @Patch(':inventoryItemId')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('inventoryItemId', ParseUUIDPipe) inventoryItemId: string,
    @Body() body: UpdateInventoryItemDto,
  ): Promise<InventoryItemOutput> {
    const inventoryItem = await this.inventoryService.update(
      inventoryItemId,
      body,
    );

    return transformInventoryItem(inventoryItem);
  }

  @Delete(':inventoryItemId')
  @Roles(UserRole.ADMIN)
  async delete(
    @Param('inventoryItemId', ParseUUIDPipe) inventoryItemId: string,
  ): Promise<void> {
    return this.inventoryService.remove(inventoryItemId);
  }
}
