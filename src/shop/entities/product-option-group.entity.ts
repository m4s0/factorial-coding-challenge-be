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
import { Product } from './product.entity';
import { ProductOption } from './product-option.entity';

@Entity()
export class ProductOptionGroup {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column()
  declare name: string;

  @Column()
  declare displayName: string;

  @Column({ default: true })
  declare isActive: boolean;

  @ManyToOne(() => Product, (product) => product.optionGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare product: Product;

  @Column()
  declare productId: string;

  @OneToMany(() => ProductOption, (option) => option.optionGroup)
  declare options: ProductOption[];

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
