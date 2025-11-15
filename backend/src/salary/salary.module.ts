import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { SalaryCalculation } from './entities/salary-calculation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalaryCalculation])],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}

