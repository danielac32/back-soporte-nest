import { Controller,Query, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto }  from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard'
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interface/valid-roles';
import { RolesGuard } from './roles.guard'
import {CreateSupportDto} from '../support/support/dto/create-support.dto'
import {UpdateSupportDto} from '../support/support/dto/update-support.dto'

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  

 @UseGuards(JwtAuthGuard)
  @RoleProtected(ValidRoles.admin) // Solo los administradores pueden actualizar el estado
  @Patch('updateSupport/:id')
 
  updateSupportStatus(@Param('id') id: string,@Body() updateSupportDto: UpdateSupportDto) {
    return this.authService.updateSupportStatus(+id, updateSupportDto.status);
  }

  @UseGuards(JwtAuthGuard)
  @RoleProtected( ValidRoles.admin )
  @Post('createSupport')
  createSupport(@Body() createSupportDto: CreateSupportDto) {
    return this.authService.createSupport(createSupportDto);
  }


@Get('by-user-id')
  getSupportsByUserId(@Query('id') id: string) {
    return this.authService.getSupportsByUserId(+id);
  }
  
  @Get('by-user-today')
  getSupportsByUserToday(@Query('id') id: string) {
    return this.authService.getSupportsByUserToday(+id);
  }

@Get('by-user')
  getSupportsByUser() {
    return this.authService.getSupportsByUser();
  }

@Get('by-user-date')
  getSupportsByUserDate(@Query('date') date: string) {
    return this.authService.getSupportsByUserDate(date);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @UseGuards(JwtAuthGuard)
  @RoleProtected( ValidRoles.admin )
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }


  @UseGuards(JwtAuthGuard,RolesGuard)
  @RoleProtected( ValidRoles.admin )//@Roles(['ADMIN', 'SUPERADMIN'])
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @RoleProtected( ValidRoles.admin )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }
  

  @UseGuards(JwtAuthGuard)
  @RoleProtected( ValidRoles.admin )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }


  @UseGuards(JwtAuthGuard)
  @RoleProtected( ValidRoles.admin )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
