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
import { ProductCategory } from './product-category.entity';
import { ProductOptionGroup } from './product-option-group.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column()
  declare name: string;

  @Column('text')
  declare description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  declare basePrice: number;

  @Column({ default: true })
  declare isActive: boolean;

  @ManyToOne(() => ProductCategory, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare category: ProductCategory;

  @Column()
  declare categoryId: string;

  @OneToMany(() => ProductOptionGroup, (optionGroup) => optionGroup.product)
  declare optionGroups: ProductOptionGroup[];

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
