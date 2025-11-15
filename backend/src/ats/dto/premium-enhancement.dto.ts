import { IsNotEmpty, IsString } from 'class-validator';

export class PremiumEnhancementDto {
  @IsNotEmpty()
  @IsString()
  checkId: string;
}

