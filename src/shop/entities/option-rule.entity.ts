import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RuleType } from './rule-type';
import { ProductOption } from './product-option.entity';

@Entity()
export class OptionRule {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({
    type: 'enum',
    enum: RuleType,
  })
  declare ruleType: RuleType;

  @ManyToOne(() => ProductOption, (option) => option.rulesAsCondition, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare ifOption: ProductOption;

  @Column()
  declare ifOptionId: string;

  @ManyToOne(() => ProductOption, (option) => option.rulesAsResult, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  declare thenOption: ProductOption;

  @Column()
  declare thenOptionId: string;

  @Column({ default: true })
  declare isActive: boolean;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
