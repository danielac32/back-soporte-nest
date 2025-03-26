import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { PrismaService } from '../../db-connections/prisma.service';
import {PostgresService} from '../../db-connections/postgres.service'
@Module({
  controllers: [SupportController],
  providers: [SupportService,PrismaService,PostgresService],
})
export class SupportModule {}
