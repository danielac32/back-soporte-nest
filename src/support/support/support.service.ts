import { Injectable } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { HttpStatus,ConflictException,NotFoundException,ExceptionFilter,HttpException, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../db-connections/prisma.service';
import { PostgresService } from '../../db-connections/postgres.service'



@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService,
    private postgresService: PostgresService
    ) {}

  async create(createSupportDto: CreateSupportDto) {
    let res=await this.prisma.support.create({
      data: createSupportDto
    });
    return {
      res
    }
  }
 
  async getTrabajadores() {
    const query = 'select id_personal, cedula, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido from personal ;'; // Cambia 'productos' por tu tabla real
    const result = await this.postgresService.query(query);
    return {trabajador:result.rows}
  } 

 async findAll() {
    const res = await this.prisma.support.findMany({});
      return{
        res
      }
  }

  private async getSupport(id:number) {
    try{
        const res = await this.prisma.support.findFirst({
            where: {
                    id: Number(id)
            },
        });
        return res;
    } catch (error) {
        throw new HttpException('Error findOne producto', 500);
    }
  }


  async findOne(id: number) {
    const res= await this.getSupport(id);
      if(!res)throw new NotFoundException(`Entity with ID ${id} not found`);
      return {
          res
      }
  }

  async update(id: number, updateSupportDto: UpdateSupportDto) {
   const res= await this.getSupport(id);
    if(!res)throw new NotFoundException(`Entity with ID ${id} not found`);

    const updatedSupport = await this.prisma.support.update({
        where: {
          id: res.id
        },
        data:{
          ...updateSupportDto
        }
    });
    return {updateSupportDto};
  }

  async remove(id: number) {
    const res= await this.getSupport(id);
    if(!res)throw new NotFoundException(`Entity with ID ${id} not found`);
     const deletedSupport = await this.prisma.support.delete({
      where: {
        id: res.id
      },
    });
    return {deletedSupport}
  }
}
