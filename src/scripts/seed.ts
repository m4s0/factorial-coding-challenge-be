import { NestFactory } from '@nestjs/core';
import { EntityManager } from 'typeorm';
import { RuleType } from '@Shop/entities/rule-type';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UserRole } from '@User/entities/user-role';
import { hashPassword } from '@Auth/utils/hash-password';
import { AppModule } from '../app.module';
import { createProductCategory } from '../../test/helpers/create-product-category';
import { createProduct } from '../../test/helpers/create-product';
import { createProductOptionGroup } from '../../test/helpers/create-product-option-group';
import { createProductOption } from '../../test/helpers/create-product-option';
import { createOptionRule } from '../../test/helpers/create-option-rule';
import { createOptionPriceRule } from '../../test/helpers/create-option-price-rule';
import { createInventoryItem } from '../../test/helpers/create-inventory-item';
import { createUser } from '../../test/helpers/create-user';

const seedDatabase = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const entityManager = app.get(EntityManager);
  const logger = app.get(Logger);

  try {
    await entityManager.connection.synchronize(true);
    logger.log('Existing data has been cleared', 'Seed');

    const adminUser = await createUser(entityManager, {
      email: 'admin@example.com',
      password: await hashPassword('Admin123!'),
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      roles: [UserRole.ADMIN],
      isActive: true,
    });

    const customerUser = await createUser(entityManager, {
      email: 'customer@example.com',
      password: await hashPassword('Customer123!'),
      username: 'customer',
      firstName: 'John',
      lastName: 'Doe',
      roles: [UserRole.CUSTOMER],
      isActive: true,
    });

    const category1 = await createProductCategory(entityManager, {
      name: 'Mountain Bikes',
      description: 'Bikes designed for off-road cycling',
    });
    const category2 = await createProductCategory(entityManager, {
      name: 'Road Bikes',
      description: 'Bikes designed for paved road surfaces',
    });

    const product1 = await createProduct(entityManager, {
      name: 'Trailblazer Pro',
      description: 'High-performance mountain bike for serious trail riders',
      basePrice: 800,
      categoryId: category1.id,
      category: category1,
    });

    const product2 = await createProduct(entityManager, {
      name: 'Road Master',
      description: 'Lightweight road bike for speed enthusiasts',
      basePrice: 700,
      categoryId: category2.id,
      category: category2,
    });

    const productOptionGroup1 = await createProductOptionGroup(
      entityManager,
      product1,
      {
        name: 'frame_type',
        displayName: 'Frame Type',
      },
    );

    const productOptionGroup2 = await createProductOptionGroup(
      entityManager,
      product1,
      {
        name: 'frame_finish',
        displayName: 'Frame Finish',
      },
    );

    const productOptionGroup3 = await createProductOptionGroup(
      entityManager,
      product1,
      {
        name: 'wheels',
        displayName: 'Wheels',
      },
    );

    const productOptionGroup4 = await createProductOptionGroup(
      entityManager,
      product1,
      {
        name: 'rim_color',
        displayName: 'Rim Color',
      },
    );

    const productOptionGroup5 = await createProductOptionGroup(
      entityManager,
      product1,
      {
        name: 'chain',
        displayName: 'Chain',
      },
    );

    const productOption1 = await createProductOption(
      entityManager,
      productOptionGroup1,
      {
        name: 'full_suspension',
        displayName: 'Full-suspension',
        basePrice: 130,
      },
    );

    const productOption2 = await createProductOption(
      entityManager,
      productOptionGroup1,
      {
        name: 'diamond',
        displayName: 'Diamond',
        basePrice: 100,
      },
    );

    const productOption3 = await createProductOption(
      entityManager,
      productOptionGroup1,
      {
        name: 'step_through',
        displayName: 'Step-through',
        basePrice: 90,
      },
    );

    const productOption4 = await createProductOption(
      entityManager,
      productOptionGroup2,
      {
        name: 'matte',
        displayName: 'Matte',
        basePrice: 35,
      },
    );

    const productOption5 = await createProductOption(
      entityManager,
      productOptionGroup2,
      {
        name: 'shiny',
        displayName: 'Shiny',
        basePrice: 30,
      },
    );

    const productOption6 = await createProductOption(
      entityManager,
      productOptionGroup3,
      {
        name: 'road_wheels',
        displayName: 'Road Wheels',
        basePrice: 80,
      },
    );

    const productOption7 = await createProductOption(
      entityManager,
      productOptionGroup3,
      {
        name: 'mountain_wheels',
        displayName: 'Mountain Wheels',
        basePrice: 95,
      },
    );

    const productOption8 = await createProductOption(
      entityManager,
      productOptionGroup3,
      {
        name: 'fat_bike_wheels',
        displayName: 'Fat Bike Wheels',
        basePrice: 120,
      },
    );

    const productOption9 = await createProductOption(
      entityManager,
      productOptionGroup4,
      {
        name: 'red',
        displayName: 'Red',
        basePrice: 25,
      },
    );

    const productOption10 = await createProductOption(
      entityManager,
      productOptionGroup4,
      {
        name: 'black',
        displayName: 'Black',
        basePrice: 15,
      },
    );

    const productOption11 = await createProductOption(
      entityManager,
      productOptionGroup4,
      {
        name: 'blue',
        displayName: 'Blue',
        basePrice: 20,
      },
    );

    const productOption12 = await createProductOption(
      entityManager,
      productOptionGroup5,
      {
        name: 'single_speed',
        displayName: 'Single-speed Chain',
        basePrice: 43,
      },
    );

    const productOption13 = await createProductOption(
      entityManager,
      productOptionGroup5,
      {
        name: 'eight_speed',
        displayName: '8-speed Chain',
        basePrice: 65,
      },
    );

    await createOptionRule(
      entityManager,
      productOption7.id,
      productOption1.id,
      RuleType.ONLY_ALLOWS,
    );

    await createOptionRule(
      entityManager,
      productOption8.id,
      productOption9.id,
      RuleType.EXCLUDES,
    );

    await createOptionPriceRule(entityManager, productOption1, productOption4, {
      price: 50,
    });

    await createOptionPriceRule(entityManager, productOption2, productOption1, {
      price: 35,
    });

    await createInventoryItem(entityManager, {
      productOptionId: productOption1.id,
      quantity: 15,
      outOfStock: false,
    });

    await createInventoryItem(entityManager, {
      productOptionId: productOption2.id,
      quantity: 20,
      outOfStock: false,
    });

    await createInventoryItem(entityManager, {
      productOptionId: productOption3.id,
      quantity: 0,
      outOfStock: true,
    });

    logger.log('Database has been seeded!', 'Seed');
  } catch (error) {
    logger.error(`Error seeding database: ${JSON.stringify(error)}`, 'Seed');
  } finally {
    await app.close();
  }
};

seedDatabase();
