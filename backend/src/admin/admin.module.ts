import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../user/entities/user.entity';
import { SalaryCalculation } from '../salary/entities/salary-calculation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SalaryCalculation]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

