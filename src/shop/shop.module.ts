import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryController } from '@Shop/controllers/product-category.controller';
import { ProductCategoriesService } from '@Shop/services/product-categories.service';
import { OptionRulesController } from '@Shop/controllers/option-rule.controller';
import { OptionPriceRulesController } from '@Shop/controllers/option-price-rule.controller';
import { OptionPriceRulesService } from '@Shop/services/option-price-rules.service';
import { ProductOptionGroupController } from './controllers/product-option-group.controller';
import { CartController } from './controllers/cart.controller';
import { ProductOptionGroupsService } from './services/product-option-groups.service';
import { CartRepository } from './repositories/cart.repository';
import { CartItemRepository } from './repositories/cart-item.repository';
import { InventoryItemRepository } from './repositories/inventory-item.repository';
import { OptionPriceRuleRepository } from './repositories/option-price-rule.repository';
import { OptionRuleRepository } from './repositories/option-rule.repository';
import { ProductRepository } from './repositories/product.repository';
import { ProductCategoryRepository } from './repositories/product-category.repository';
import { ProductOptionGroupRepository } from './repositories/product-option-group.repository';
import { ProductOptionRepository } from './repositories/product-option.repository';
import { Product } from './entities/product.entity';
import { InventoryController } from './controllers/inventory.controller';
import { ProductController } from './controllers/product.controller';
import { ProductOptionController } from './controllers/product-option.controller';
import { CartService } from './services/cart.service';
import { ProductsService } from './services/products.service';
import { InventoryService } from './services/inventory.service';
import { ProductOptionsService } from './services/product-options.service';
import { OptionRulesService } from './services/option-rules.service';
import { PricingService } from './services/pricing.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartItemOption } from './entities/cart-item-option.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { OptionPriceRule } from './entities/option-price-rule.entity';
import { OptionRule } from './entities/option-rule.entity';
import { ProductCategory } from './entities/product-category.entity';
import { ProductOptionGroup } from './entities/product-option-group.entity';
import { ProductOption } from './entities/product-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      CartItemOption,
      InventoryItem,
      OptionPriceRule,
      OptionRule,
      Product,
      ProductCategory,
      ProductOption,
      ProductOptionGroup,
    ]),
  ],
  controllers: [
    CartController,
    InventoryController,
    OptionRulesController,
    OptionPriceRulesController,
    ProductCategoryController,
    ProductController,
    ProductOptionController,
    ProductOptionGroupController,
  ],
  providers: [
    CartRepository,
    CartItemRepository,
    InventoryItemRepository,
    OptionPriceRuleRepository,
    OptionRuleRepository,
    ProductRepository,
    ProductCategoryRepository,
    ProductOptionRepository,
    ProductOptionGroupRepository,
    CartService,
    InventoryService,
    OptionRulesService,
    OptionPriceRulesService,
    PricingService,
    ProductCategoriesService,
    ProductsService,
    ProductOptionsService,
    ProductOptionGroupsService,
  ],
})
export class ShopModule {}
