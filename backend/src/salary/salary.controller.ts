import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { SalaryService, SalaryBreakdown } from './salary.service';
import { CalculateSalaryDto } from './dto/calculate-salary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('api/salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async calculate(
    @Body() dto: CalculateSalaryDto,
    @CurrentUser() user: User,
  ): Promise<SalaryBreakdown> {
    return this.salaryService.calculateSalary(dto, user.id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@CurrentUser() user: User) {
    return this.salaryService.getUserCalculations(user.id);
  }
}

