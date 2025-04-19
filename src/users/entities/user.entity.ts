import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  declare createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  declare updatedAt: Date;
}
