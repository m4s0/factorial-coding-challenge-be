import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductOption } from './product-option.entity';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'int' })
  declare quantity: number;

  @Column({ default: false })
  declare outOfStock: boolean;

  @OneToOne(
    () => ProductOption,
    (productOption) => productOption.inventoryItem,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  declare productOption: ProductOption;

  @Column()
  declare productOptionId: string;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
