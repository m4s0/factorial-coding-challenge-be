import { CurrentUser } from '@Auth/decorators/current-user.decorator';
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
import { CartService } from '@Shop/services/cart.service';
import { User } from '@User/entities/user.entity';
import { AddToCartDto } from '@Shop/dtos/add-to-cart.dto';
import { UpdateCartQuantityDto } from '@Shop/dtos/update-cart-quantity.dto';
import { CartOutput } from '@Shop/types/cart.output';
import { transformCart } from '@Shop/services/transfomers/transform-cart';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async get(@CurrentUser() user: User): Promise<CartOutput> {
    const cart = await this.cartService.getCart(user);
    return transformCart(cart);
  }

  @Post('items')
  async addItem(
    @CurrentUser() user: User,
    @Body() body: AddToCartDto,
  ): Promise<CartOutput> {
    const cart = await this.cartService.addItem(user, body);
    return transformCart(cart);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK)
  async removeItem(
    @CurrentUser() user: User,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<CartOutput> {
    const cart = await this.cartService.removeItem(user, itemId);
    return transformCart(cart);
  }

  @Patch('items/:itemId')
  async updateItemQuantity(
    @CurrentUser() user: User,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() body: UpdateCartQuantityDto,
  ): Promise<CartOutput> {
    const cart = await this.cartService.updateItemQuantity(user, itemId, body);
    return transformCart(cart);
  }
}
