import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => ProductOption, (option) => option.inventoryItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare productOption: ProductOption;

  @Column()
  declare productOptionId: string;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
