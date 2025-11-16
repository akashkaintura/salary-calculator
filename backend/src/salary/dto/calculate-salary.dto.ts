import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUrl, Min, IsBoolean } from 'class-validator';

export class CalculateSalaryDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  ctc: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsBoolean()
  isRelocation?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  relocationAllowance?: number;

  @IsOptional()
  @IsUrl()
  githubProfile?: string;

  @IsOptional()
  @IsUrl()
  linkedinProfile?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offerInHand?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  variablePay?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  insurance?: number;
}

