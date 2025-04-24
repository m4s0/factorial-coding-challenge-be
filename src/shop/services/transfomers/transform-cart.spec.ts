import { transformCart } from '@Shop/services/transfomers/transform-cart';
import { Cart } from '@Shop/entities/cart.entity';
import { User } from '@User/entities/user.entity';
import { CartItem } from '@Shop/entities/cart-item.entity';
import { CartItemOption } from '@Shop/entities/cart-item-option.entity';
import { Product } from '@Shop/entities/product.entity';

describe('transformOptionGroup', () => {
  it('should transform cart correctly', () => {
    const cart = {
      id: '1fd7b09c-6da1-4f84-afe5-9ab0117c4cab',
      totalPrice: 835.0,
      user: {} as User,
      userId: '3e626cc9-9368-4b62-984b-bb94b1e58794',
      createdAt: new Date('2024-03-15T10:00:00Z'),
      updatedAt: new Date('2024-03-15T10:00:00Z'),
      items: [
        {
          id: 'a87f1507-55f5-41e1-b66e-34b245dd3e00',
          cart: {} as Cart,
          cartId: '1fd7b09c-6da1-4f84-afe5-9ab0117c4cab',
          productId: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
          quantity: 1,
          price: 835.0,
          totalPrice: 835.0,
          createdAt: new Date('2024-03-15T10:00:00Z'),
          updatedAt: new Date('2024-03-15T10:00:00Z'),
          product: {
            id: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
            name: 'Trailblazer Pro',
            description:
              'High-performance mountain bike for serious trail riders',
            basePrice: 800.0,
            categoryId: '3fee385c-8b66-4571-9d24-4c18e9223515',
            createdAt: new Date('2024-03-15T10:00:00Z'),
            updatedAt: new Date('2024-03-15T10:00:00Z'),
          } as Product,
          itemOptions: [
            {
              id: '1db5f36b-d590-4334-83db-0004701f8965',
              createdAt: new Date('2024-03-15T10:00:00Z'),
              updatedAt: new Date('2024-03-15T10:00:00Z'),
              optionId: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
              option: {
                id: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
                name: 'matte',
                displayName: 'Matte',
                basePrice: 35.0,
                optionGroupId: 'a95635bd-fd69-44b7-8f63-cab9fbaacbf1',
                createdAt: new Date('2024-03-15T10:00:00Z'),
                updatedAt: new Date('2024-03-15T10:00:00Z'),
              },
            } as CartItemOption,
          ],
        } as CartItem,
      ],
    };

    const result = transformCart(cart);

    expect(result).toMatchSnapshot();
  });
});
