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
import { ProductOptionGroup } from './product-option-group.entity';
import { InventoryItem } from './inventory-item.entity';
import { OptionRule } from './option-rule.entity';
import { OptionPriceRule } from './option-price-rule.entity';

@Entity()
export class ProductOption {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column()
  declare name: string;

  @Column()
  declare displayName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  declare basePrice: number;

  @Column({ default: true })
  declare isActive: boolean;

  @ManyToOne(() => ProductOptionGroup, (optionGroup) => optionGroup.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare optionGroup: ProductOptionGroup;

  @Column()
  declare optionGroupId: string;

  @OneToMany(
    () => InventoryItem,
    (inventoryItem) => inventoryItem.productOption,
  )
  declare inventoryItems: InventoryItem[];

  @OneToMany(() => OptionRule, (optionRule) => optionRule.ifOption)
  declare rulesAsCondition: OptionRule[];

  @OneToMany(() => OptionRule, (optionRule) => optionRule.thenOption)
  declare rulesAsResult: OptionRule[];

  @OneToMany(() => OptionPriceRule, (priceRule) => priceRule.targetOption)
  declare priceRules: OptionPriceRule[];

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
