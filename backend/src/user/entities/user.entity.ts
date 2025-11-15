import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SalaryCalculation } from '../../salary/entities/salary-calculation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  githubId: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string; // Hashed password for email/password auth

  @Column({ nullable: true })
  githubProfile: string;

  @Column({ nullable: true })
  linkedinProfile: string;

  @OneToMany(() => SalaryCalculation, (calculation) => calculation.user)
  calculations: SalaryCalculation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

