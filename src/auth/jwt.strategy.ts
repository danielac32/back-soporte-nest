import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException,Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtPayload } from './interface/jwt-payload.interface'
import { PrismaService } from '../db-connections/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
  	const user = await this.prisma.user.findFirst({
          where: {
                  id: Number(payload.id)
          }
    });
  	if(!user.isActive)
       throw new UnauthorizedException('User is inactive, talk with an admin');
    
    return user;
  }
}