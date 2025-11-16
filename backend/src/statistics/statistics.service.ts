import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { SalaryCalculation } from '../salary/entities/salary-calculation.entity';
import { AtsCheck } from '../ats/entities/ats-check.entity';
import { Payment } from '../payment/entities/payment.entity';

export interface Statistics {
  users: {
    total: number;
    active: number;
    admins: number;
    regular: number;
    registeredThisMonth: number;
    registeredThisWeek: number;
    registeredToday: number;
  };
  salary: {
    totalCalculations: number;
    averageCtc: number;
    minCtc: number;
    maxCtc: number;
    averageInHand: number;
    salaryRanges: {
      range: string;
      count: number;
    }[];
    topCities: {
      city: string;
      count: number;
    }[];
    calculationsThisMonth: number;
    calculationsThisWeek: number;
  };
  ats: {
    totalChecks: number;
    averageScore: number;
    checksThisMonth: number;
    checksThisWeek: number;
    premiumUpgrades: number;
  };
  payments: {
    totalRevenue: number;
    totalTransactions: number;
    successfulPayments: number;
    pendingPayments: number;
    revenueThisMonth: number;
    revenueThisWeek: number;
  };
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SalaryCalculation)
    private salaryRepository: Repository<SalaryCalculation>,
    @InjectRepository(AtsCheck)
    private atsCheckRepository: Repository<AtsCheck>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async getStatistics(): Promise<Statistics> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // User Statistics
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { isActive: true } });
    const adminUsers = await this.userRepository.count({ where: { role: UserRole.ADMIN } });
    const regularUsers = totalUsers - adminUsers;
    const registeredThisMonth = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :startOfMonth', { startOfMonth })
      .getCount();
    const registeredThisWeek = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :startOfWeek', { startOfWeek })
      .getCount();
    const registeredToday = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :startOfToday', { startOfToday })
      .getCount();

    // Salary Statistics
    const allCalculations = await this.salaryRepository.find({
      select: ['ctc', 'inHandSalary', 'city', 'createdAt'],
    });

    const totalCalculations = allCalculations.length;
    const calculationsThisMonth = allCalculations.filter(
      c => new Date(c.createdAt) >= startOfMonth
    ).length;
    const calculationsThisWeek = allCalculations.filter(
      c => new Date(c.createdAt) >= startOfWeek
    ).length;
    const ctcValues = allCalculations.map(c => Number(c.ctc)).filter(v => v > 0);
    const inHandValues = allCalculations.map(c => Number(c.inHandSalary)).filter(v => v > 0);

    const averageCtc = ctcValues.length > 0
      ? ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length
      : 0;
    const minCtc = ctcValues.length > 0 ? Math.min(...ctcValues) : 0;
    const maxCtc = ctcValues.length > 0 ? Math.max(...ctcValues) : 0;
    const averageInHand = inHandValues.length > 0
      ? inHandValues.reduce((a, b) => a + b, 0) / inHandValues.length
      : 0;

    // Salary Ranges
    const salaryRanges = this.calculateSalaryRanges(ctcValues);

    // Top Cities
    const cityCounts = this.countByCity(allCalculations);

    // ATS Statistics
    const totalAtsChecks = await this.atsCheckRepository.count();
    const allAtsChecks = await this.atsCheckRepository.find({
      select: ['score', 'createdAt'],
    });
    const scores = allAtsChecks.map(c => c.score).filter(s => s > 0);
    const averageScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;
    const checksThisMonth = allAtsChecks.filter(
      c => new Date(c.createdAt) >= startOfMonth
    ).length;
    const checksThisWeek = allAtsChecks.filter(
      c => new Date(c.createdAt) >= startOfWeek
    ).length;

    // Payment Statistics
    const allPayments = await this.paymentRepository.find({
      select: ['amount', 'status'],
    });
    const successfulPayments = allPayments.filter(p => p.status === PaymentStatus.COMPLETED);
    const totalRevenue = successfulPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const pendingPayments = allPayments.filter(p => p.status === PaymentStatus.PENDING).length;
    const premiumUpgrades = successfulPayments.length;

    // Payment revenue trends
    const paymentsThisMonth = allPayments.filter(
      p => new Date(p.createdAt) >= startOfMonth && p.status === PaymentStatus.COMPLETED
    );
    const revenueThisMonth = paymentsThisMonth.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const paymentsThisWeek = allPayments.filter(
      p => new Date(p.createdAt) >= startOfWeek && p.status === PaymentStatus.COMPLETED
    );
    const revenueThisWeek = paymentsThisWeek.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        admins: adminUsers,
        regular: regularUsers,
        registeredThisMonth,
        registeredThisWeek,
        registeredToday,
      },
      salary: {
        totalCalculations,
        averageCtc: Number(averageCtc.toFixed(2)),
        minCtc,
        maxCtc,
        averageInHand: Number(averageInHand.toFixed(2)),
        salaryRanges,
        topCities: cityCounts.slice(0, 10),
        calculationsThisMonth,
        calculationsThisWeek,
      },
      ats: {
        totalChecks: totalAtsChecks,
        averageScore: Number(averageScore.toFixed(2)),
        checksThisMonth,
        checksThisWeek,
        premiumUpgrades,
      },
      payments: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalTransactions: allPayments.length,
        successfulPayments: successfulPayments.length,
        pendingPayments,
        revenueThisMonth: Number(revenueThisMonth.toFixed(2)),
        revenueThisWeek: Number(revenueThisWeek.toFixed(2)),
      },
    };
  }

  private calculateSalaryRanges(ctcValues: number[]): { range: string; count: number }[] {
    const ranges = [
      { min: 0, max: 500000, label: '0-5 Lakhs' },
      { min: 500000, max: 1000000, label: '5-10 Lakhs' },
      { min: 1000000, max: 1500000, label: '10-15 Lakhs' },
      { min: 1500000, max: 2000000, label: '15-20 Lakhs' },
      { min: 2000000, max: 3000000, label: '20-30 Lakhs' },
      { min: 3000000, max: 5000000, label: '30-50 Lakhs' },
      { min: 5000000, max: Infinity, label: '50+ Lakhs' },
    ];

    return ranges.map(range => ({
      range: range.label,
      count: ctcValues.filter(ctc => ctc >= range.min && ctc < range.max).length,
    }));
  }

  private countByCity(calculations: SalaryCalculation[]): { city: string; count: number }[] {
    const cityMap = new Map<string, number>();
    
    calculations.forEach(calc => {
      const city = calc.city || 'Unknown';
      cityMap.set(city, (cityMap.get(city) || 0) + 1);
    });

    return Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }
}

