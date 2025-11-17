import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUrl, Min, IsBoolean, Max, MaxLength } from 'class-validator';

export class CalculateSalaryDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(999999999) // Prevent extremely large numbers
  ctc: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  company?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  designation?: string;

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

