import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      console.error('JWT validation failed: Invalid payload', payload);
      throw new UnauthorizedException('Invalid token payload');
    }
    
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      console.error('JWT validation failed: User not found', payload.sub);
      throw new UnauthorizedException('User not found');
    }
    
    if (!user.isActive) {
      console.error('JWT validation failed: User is inactive', payload.sub);
      throw new UnauthorizedException('User account is inactive');
    }
    
    return user;
  }
}

