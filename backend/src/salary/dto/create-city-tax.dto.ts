import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AdditionalDeductionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  type: 'fixed' | 'percentage';
}

export class CreateCityTaxDto {
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsNumber()
  professionalTax: number;

  @IsOptional()
  @IsNumber()
  hraExemptionPercent?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalDeductionDto)
  additionalDeductions?: AdditionalDeductionDto[];

  @IsOptional()
  @IsString()
  defaultTaxRegime?: string;
}

