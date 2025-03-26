import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { PrismaService } from '../../db-connections/prisma.service';

@Module({
  controllers: [SeederController],
  providers: [SeederService,PrismaService],
})
export class SeederModule {}
