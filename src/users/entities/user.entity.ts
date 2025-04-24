import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '@User/entities/user-role';
import { Cart } from '@Shop/entities/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column('varchar', { length: 100, nullable: false, unique: true })
  declare email: string;

  @Column('varchar', { length: 100, nullable: false })
  declare password: string;

  @Column('varchar', { length: 100, nullable: true })
  declare username: string;

  @Column('varchar', { length: 100, nullable: true })
  declare firstName: string;

  @Column('varchar', { length: 100, nullable: true })
  declare lastName: string;

  @Column({ default: true })
  declare isActive: boolean;

  @Column({
    type: 'enum',
    array: true,
    enum: UserRole,
    default: [UserRole.CUSTOMER],
  })
  declare roles: UserRole[];

  @OneToOne(() => Cart, (cart) => cart.user)
  declare cart: Cart;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
