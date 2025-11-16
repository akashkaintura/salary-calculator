import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../user/entities/user.entity';
import { SalaryCalculation } from '../salary/entities/salary-calculation.entity';
import { AtsCheck } from '../ats/entities/ats-check.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SalaryCalculation, AtsCheck, Payment]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

