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
export class OptionPriceRule {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  declare price: number;

  @ManyToOne(() => ProductOption, (option) => option.priceRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare targetOption: ProductOption;

  @Column()
  declare targetOptionId: string;

  @ManyToOne(() => ProductOption, (option) => option.priceRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare dependentOption: ProductOption;

  @Column()
  declare dependentOptionId: string;

  @Column({ default: true })
  declare isActive: boolean;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
