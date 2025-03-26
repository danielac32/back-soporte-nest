
import { ApiProperty } from '@nestjs/swagger';
// producto.dto.ts
import { IsString, IsNotEmpty, IsInt, IsOptional, IsPositive , MaxLength, MinLength ,ValidateNested ,IsArray} from 'class-validator';
import { Type } from 'class-transformer';



export class CreateSupportDto {
@ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string; // Nombre de la persona
@ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string; // Descripción del soporte
@ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string; // Estado del soporte (Pendiente, En Progreso, Resuelto, Cerrado)
@ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number; // ID del usuario asociado al soporte
}
