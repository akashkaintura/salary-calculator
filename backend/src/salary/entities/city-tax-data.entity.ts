import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('city_tax_data')
export class CityTaxData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  state: string;

  // Professional Tax (monthly)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 200 })
  professionalTax: number;

  // HRA exemption percentage (for tax calculation)
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 50 })
  hraExemptionPercent: number;

  // Additional city-specific deductions
  @Column({ type: 'jsonb', nullable: true })
  additionalDeductions: {
    name: string;
    amount: number;
    type: 'fixed' | 'percentage';
  }[];

  // Tax regime preference (old/new)
  @Column({ type: 'varchar', default: 'new' })
  defaultTaxRegime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

