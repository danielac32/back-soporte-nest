import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean,IsEmail, IsString, Matches, MaxLength, MinLength,IsOptional } from 'class-validator';

export class CreateAuthDto {
    @ApiProperty()
	@IsString()
    @IsEmail()
    email: string;
@ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(10)
    password: string;
@ApiProperty()
    @IsString()
    @MinLength(1)
    name: string;
@ApiProperty()
    @IsOptional()
    @IsString()
    rol: string;
@ApiProperty()
    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}
