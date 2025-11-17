import { Controller, Get } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('api/common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('cities')
  async getCities() {
    const cities = await this.commonService.getCities();
    return {
      cities: cities.map(city => city.name),
    };
  }

  @Get('companies')
  async getCompanies() {
    const companies = await this.commonService.getCompanies();
    return {
      companies: companies.map(company => company.name),
    };
  }

  @Get('designations')
  async getDesignations() {
    const designations = await this.commonService.getDesignations();
    return {
      designations: designations.map(designation => designation.title),
    };
  }
}

