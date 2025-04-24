import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { transformInventoryItem } from '@Shop/services/transfomers/inventory-item.transformer';
import { InventoryItemOutput } from '@Shop/types/inventory-item.output';
import { InventoryStatusForProduct } from '@Shop/types/inventory-status-for-product';
import { Public } from '@Auth/decorators/public.decorator';
import { Roles } from '@Auth/decorators/roles.decorator';
import { UserRole } from '@User/entities/user-role';
import { InventoryService } from '../services/inventory.service';
import { UpdateInventoryDto } from '../dtos/update-inventory-dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Public()
  @Get('product/:productId')
  getByProductId(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<InventoryStatusForProduct[]> {
    return this.inventoryService.getInventoryStatusForProduct(productId);
  }

  @Patch('option/:optionId')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('optionId', ParseUUIDPipe) optionId: string,
    @Body() body: UpdateInventoryDto,
  ): Promise<InventoryItemOutput> {
    const inventoryItem = await this.inventoryService.updateInventory(
      optionId,
      body,
    );

    return transformInventoryItem(inventoryItem);
  }
}
