import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { SalaryService, SalaryBreakdown } from './salary.service';
import { CalculateSalaryDto } from './dto/calculate-salary.dto';
import { CreateCityTaxDto } from './dto/create-city-tax.dto';
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

  // City Tax Data Management APIs
  @Get('cities')
  async getCities() {
    return this.salaryService.getAllCityTaxData();
  }

  @Get('cities/:city')
  async getCityTaxData(@Param('city') city: string) {
    return this.salaryService.getCityTaxData(city);
  }

  @Post('cities')
  @UseGuards(JwtAuthGuard)
  async createCityTaxData(@Body() dto: CreateCityTaxDto) {
    return this.salaryService.createCityTaxData(dto);
  }

  @Put('cities/:city')
  @UseGuards(JwtAuthGuard)
  async updateCityTaxData(
    @Param('city') city: string,
    @Body() dto: Partial<CreateCityTaxDto>,
  ) {
    return this.salaryService.updateCityTaxData(city, dto);
  }

  @Delete('cities/:city')
  @UseGuards(JwtAuthGuard)
  async deleteCityTaxData(@Param('city') city: string) {
    return this.salaryService.deleteCityTaxData(city);
  }
}

