import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { ProductOption } from './product-option.entity';

@Entity()
export class CartItemOption {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ManyToOne(() => CartItem, (cartItem) => cartItem.itemOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare cartItem: CartItem;

  @Column()
  declare cartItemId: string;

  @ManyToOne(() => ProductOption, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare option: ProductOption;

  @Column()
  declare optionId: string;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
