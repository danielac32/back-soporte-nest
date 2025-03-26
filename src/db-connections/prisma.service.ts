
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  /*async dropAllTables(): Promise<boolean> {
    try {
      // Utilizar una plantilla de cadena literal
      await this.$executeRaw`DROP TABLE IF EXISTS "Modificacion" CASCADE`;
      await this.$executeRaw`DROP TABLE IF EXISTS "Producto" CASCADE`;
      await this.$executeRaw`DROP TABLE IF EXISTS "Categoria" CASCADE`;
      await this.$executeRaw`DROP TABLE IF EXISTS "UserEntity" CASCADE`;

      return true;
    } catch (error) {
      throw new Error(`Error al eliminar las tablas de la base de datos: ${error.message}`);
    }
  }*/
}