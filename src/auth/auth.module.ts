import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../db-connections/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';


@Module({
  controllers: [AuthController],
  imports: [
      ConfigModule,
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '2h' },
      }),

  ],
  providers: [AuthService,PrismaService,JwtStrategy],
  exports: [
    AuthService,
    JwtStrategy,
    JwtModule
  ]
})
export class AuthModule {}
