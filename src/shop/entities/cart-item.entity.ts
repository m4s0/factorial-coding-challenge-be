import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItemOption } from '@Shop/entities/cart-item-option.entity';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare cart: Cart;

  @Column()
  declare cartId: string;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare product: Product;

  @Column()
  declare productId: string;

  @Column({ type: 'int', default: 1 })
  declare quantity: number;

  @OneToMany(
    () => CartItemOption,
    (cartItemOption) => cartItemOption.cartItem,
    {
      cascade: true,
    },
  )
  declare itemOptions: CartItemOption[];

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  declare price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  declare totalPrice: number;
}
