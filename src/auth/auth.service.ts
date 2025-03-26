import { Injectable, HttpStatus,ConflictException,NotFoundException,ExceptionFilter,HttpException, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto }  from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../db-connections/prisma.service';
import {User} from './interface/user.interface'
import {CreateSupportDto} from '../support/support/dto/create-support.dto'
import {UpdateSupportDto} from '../support/support/dto/update-support.dto'


@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    ) {}




async updateSupportStatus(id: number, newStatus: string) {
  // Verificar si el soporte existe
  const support = await this.prisma.support.findUnique({
    where: { id },
  });

  if (!support) {
    throw new NotFoundException(`Soporte con ID ${id} no encontrado`);
  }

  // Actualizar el estado del soporte
  const updatedSupport = await this.prisma.support.update({
    where: { id },
    data: { status: newStatus },
  });

  return {
    message: 'Estado del soporte actualizado correctamente',
    support: updatedSupport,
  };
}
 


  async createSupport(createSupportDto: CreateSupportDto) {
        
        try{
            const newUser = await this.prisma.support.create({
                    data:{
                        ...createSupportDto,
                    }
            });
   
            return {
              message: "Support has been created successfully",
              newUser
            }
        } catch (error) {
            throw new HttpException('Error creating Support', 500);
        }
  }




async getSupportsByUserId(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId }, // Filtra por el ID del usuario
    include: { supports: true }, // Incluye los soportes del usuario
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Agrupar soportes por fecha (createdAt)
  const supportsByDate = user.supports.reduce((acc, support) => {
    const date = support.createdAt.toISOString().split('T')[0]; // Obtener solo la fecha (YYYY-MM-DD)
    if (!acc[date]) {
      acc[date] = []; // Inicializar el array si la fecha no existe
    }
    acc[date].push(support); // Agregar el soporte al array correspondiente
    return acc;
  }, {} as Record<string, typeof user.supports>);

  // Formatear la respuesta
  const result = Object.keys(supportsByDate).map((date) => ({
    date, // Fecha
    count: supportsByDate[date].length, // Cantidad de soportes en esa fecha
    supports: supportsByDate[date].map((support) => ({
      id: support.id,
      status: support.status,
      description: support.description,
      name: support.name,
      createdAt: support.createdAt,
    })),
  }));

  return {
    supportCount: user.supports.length, // Cantidad total de soportes
    supportsByDate: result, // Soportes agrupados por fecha
  };
}



async getSupportsByUserId2(userId: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId }, // Filtra por el ID del usuario
    include: { supports: true }, // Incluye los soportes del usuario
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return {
    supportCount: user.supports.length, // Cantidad total de soportes
    supports: user.supports.map(support => ({
      status:support.status,
      description:support.description,
      name:support.name,
      id: support.id,
      createdAt: support.createdAt, // Fecha de creación de cada soporte
    })),
  };
}


async getSupportsByUserToday(userId: number) {
  const today = new Date(); // Fecha y hora actual
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Inicio del día (00:00:00)
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Inicio del día siguiente (00:00:00)

  const user = await this.prisma.user.findUnique({
    where: { id: userId }, // Filtra por el ID del usuario
    include: {
      supports: {
        where: {
          createdAt: {
            gte: todayStart, // Fecha mayor o igual al inicio del día
            lt: todayEnd, // Fecha menor al inicio del día siguiente
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  console.log(today)
  return {
    supportCount: user.supports.length, // Cantidad de soportes creados hoy
    supports: user.supports.map(support => ({
      status:support.status,
      description:support.description,
      name:support.name,
      id: support.id,
      createdAt: support.createdAt, // Fecha de creación de cada soporte
    })),
  };
}

async getSupportsByUser() {
  const users = await this.prisma.user.findMany({
    where: { role: 'USER' }, // Filtra solo usuarios con rol USER
    include: { supports: true }, // Incluye los soportes de cada usuario
  });

  const formattedUsers = users.map(user => ({
    name: user.name,
    supportCount: user.supports.length, // Cantidad de soportes
  }));

  return { users: formattedUsers }; // Devuelve un objeto con la propiedad `users`
}
  

async getSupportsByUserDate(date:string) {
    const users = await this.prisma.user.findMany({
    where: { role: 'USER' }, // Filtra solo usuarios con rol USER
    include: {
      supports: {
        where: {
          createdAt: {
            gte: new Date(date), // Fecha mayor o igual a la seleccionada
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) // Fecha menor al día siguiente
          }
        }
      }
    },
  });

  const formattedUsers = users.map(user => ({
    name: user.name,
    supportCount: user.supports.length, // Cantidad de soportes
  }));

  return { users: formattedUsers }; // Devuelve un objeto con la propiedad `users`
}
 


  async create(createAuthDto: CreateAuthDto) {
        const { password, ...userData } = createAuthDto;
        let user = await this.prisma.user.findFirst({
                  where: {
                          email: userData.email
                  }
        });
        if(user){
           throw new ConflictException('User already exist');
        }
        try{
            const newUser = await this.prisma.user.create({
                    data:{
                        ...userData,
                        password:bcrypt.hashSync( password, 10 )
                    }
            });
            delete newUser.password;
            return {
              message: "User has been created successfully",
              newUser
            }
        } catch (error) {
            throw new HttpException('Error creating user', 500);
        }
  }

  

  async findAll() {
      const users = await this.prisma.user.findMany();
      return{
        users
      }
  }

  private async getUser(id:string):Promise<User> {
      let user;
        // Verifica si el término es un correo electrónico
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) {
            user = await this.prisma.user.findFirst({
                where: {
                        email: id
                }
            });
        }
        if (!user) {
            const userId = Number(id);
            if (!isNaN(userId)) {
              user = await this.prisma.user.findFirst({
                where: {
                  id: userId
                }
              });
            }
        }
        return user;
  }

  async findOne(id: string) {
        const user= await this.getUser(id);
        if(!user)throw new NotFoundException(`Entity with ID ${id} not found`);
        return {
            user
        }
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const user= await this.getUser(id);
    if(!user)throw new NotFoundException(`Entity with ID ${id} not found`);
    const {password,...userData}=updateAuthDto
 
    let tempData: UpdateAuthDto=null;
    let hashPassword=null;

    if(password){
       hashPassword = bcrypt.hashSync( password, 10 );
       tempData={password:hashPassword,...userData};
    }else{
       tempData={...userData};
    }
    const updatedUser = await this.prisma.user.update({
        where: {
          email: user.email
        },
        data:{
          ...tempData
        }
    });
    delete updatedUser.password;
    return {updatedUser};
  }

  async remove(id: string) {
    const user= await this.getUser(id);
    if(!user)throw new NotFoundException(`Entity with ID ${id} not found`);

    const deletedUser = await this.prisma.user.delete({
      where: {
        email: user.email
      },
    });
    delete deletedUser.password;
    return {deletedUser}
  }

  async login( loginUserDto: LoginUserDto ) {
    const { email, password } = loginUserDto;
    let user;
    user = await this.prisma.user.findFirst({
        where: {
                email: email
        }
    });
    if(!user)
      throw new NotFoundException(`${email} not found`);

    if( !bcrypt.compareSync(password, user.password) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    delete user.password;
    
    const payload={ id: user.id, name:user.name };

    const token= await this.jwtService.sign(payload)

    return{
       status: HttpStatus.OK,
       user,
       token
    }
  }
}
