import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { City } from './entities/city.entity';
import { Company } from './entities/company.entity';
import { Designation } from './entities/designation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, Company, Designation])],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}

