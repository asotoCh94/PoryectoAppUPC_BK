import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { HasRoles } from 'src/config/jwt/has-roles';
import { JwtRolesGuard } from 'src/config/jwt/jwt-roles.guard';
import { JwtAuthGuard } from 'src/config/jwt/jwt-auth.guard';
import { JwtRol } from 'src/config/jwt/jwt-rol';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolService: RolesService) { }

    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)   
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('register')
    async createRol(@Body() rol: CreateRolDto) {
        try {
            const result = await this.rolService.createRol(rol);
            return { message: 'Rol creado correctamente', data: result };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
    }
}
