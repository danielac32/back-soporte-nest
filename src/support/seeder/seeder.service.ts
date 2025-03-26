import { Injectable } from '@nestjs/common';
import { CreateSeederDto } from './dto/create-seeder.dto';
import { UpdateSeederDto } from './dto/update-seeder.dto';
import { PrismaService } from '../../db-connections/prisma.service';

import * as bcrypt from 'bcrypt';
import { Role } from '../../interface/emun';


@Injectable()
export class SeederService {
  constructor(
    private prisma: PrismaService
  ) {}

  create(createSeederDto: CreateSeederDto) {
    return 'This action adds a new seeder';
  }

  async findAll() {
  const admin1 = await this.prisma.user.create({
    data: {
      name: 'Admin 1',
      email: 'admin@admin.com',
      password: bcrypt.hashSync('123456', 10),
      role: Role.ADMIN,
    },
  });

  const admin2 = await this.prisma.user.create({
    data: {
      name: 'Admin 2',
      email: 'admin2@admin.com',
      password: bcrypt.hashSync('123456', 10),
      role: Role.ADMIN,
    },
  });



 const users = [
      { name: 'Maikel', supports: 3 },
      { name: 'Winder', supports: 5 },
      { name: 'Shayel', supports: 2 },
      { name: 'Albert Subgeydy', supports: 4 },
      { name: 'Jennifer', supports: 6 },
      { name: 'Carlos', supports: 1 },
      { name: 'Freddy', supports: 7 },
      { name: 'Ana', supports: 3 },
      { name: 'Luis', supports: 2 },
      { name: 'Maria', supports: 5 },
    ];

     for (const user of users) {
      // Crear el usuario
      const createdUser = await this.prisma.user.create({
        data: {
          name: user.name,
          email: `${user.name.toLowerCase()}@example.com`, // Email único carlos@example.com
          password: bcrypt.hashSync('123456', 10), // Contraseña por defecto
          role: 'USER',
        },
      });

      // Crear los soportes para el usuario
      for (let i = 1; i <= user.supports; i++) {
        await this.prisma.support.create({
          data: {
            name: `Soporte ${i} de ${user.name}`,
            description: `Descripción del soporte ${i}`,
            status: 'Pendiente',
            userId: createdUser.id,
          },
        });
      }
    }

    
 /* const user1 = await this.prisma.user.create({
    data: {
      name: 'User 1',
      email: 'user@user.com',
      password: bcrypt.hashSync('123456', 10),
      role: Role.USER,
    },
  });

  const user2 = await this.prisma.user.create({
    data: {
      name: 'User 2',
      email: 'user2@user.com',
      password: bcrypt.hashSync('123456', 10),
      role: Role.USER,
    },
  });

  await this.prisma.support.create({
    data: {
      name: 'Support 1',
      description: 'Description for support 1',
      userId: user1.id,
    },
  });

  await this.prisma.support.create({
    data: {
      name: 'Support 2',
      description: 'Description for support 2',
      userId: user2.id,
    },
  });*/
/*
   

  // Crear soportes
  await this.prisma.support.create({
    data: {
      title: 'Support 1',
      description: 'Description for support 1',
      userId: admin1.id,
    },
  });

  await this.prisma.support.create({
    data: {
      title: 'Support 2',
      description: 'Description for support 2',
      userId: user1.id,
    },
  });*/
    return `This action returns all seeder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seeder`;
  }

  update(id: number, updateSeederDto: UpdateSeederDto) {
    return `This action updates a #${id} seeder`;
  }

  remove(id: number) {
    return `This action removes a #${id} seeder`;
  }
}
