import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('salary_calculations')
export class SalaryCalculation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  ctc: number;

  @Column()
  city: string;

  @Column({ nullable: true })
  githubProfile: string;

  @Column({ nullable: true })
  linkedinProfile: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  offerInHand: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  variablePay: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  insurance: number;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isRelocation: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  relocationAllowance: number;

  // Calculated values
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  fixedCtc: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  hra: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  specialAllowance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pf: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  esi: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  professionalTax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  incomeTax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  gratuity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  inHandSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monthlyDeductions: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  annualDeductions: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

