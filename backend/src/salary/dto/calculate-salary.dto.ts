import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUrl, Min } from 'class-validator';

export class CalculateSalaryDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  ctc: number;

  @IsNotEmpty()
  @IsString()
  city: string;

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

