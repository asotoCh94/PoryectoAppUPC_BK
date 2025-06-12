import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { UserImgService } from './user_img.service';
import { HasRoles } from 'src/config/jwt/has-roles';
import { JwtRol } from 'src/config/jwt/jwt-rol';
import { JwtAuthGuard } from 'src/config/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/config/jwt/jwt-roles.guard';
import { CreateUserImgDto } from './dto/create-user_img.dto';

@Controller('user-img')
export class UserImgController {
    constructor(private readonly userImgService: UserImgService) { }

    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)   
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('insertar')
    async createRol(@Body() userImg: CreateUserImgDto) {
        try {
            const result = await this.userImgService.InsertarUserImg(userImg);
            return { message: 'Registro correctamente', data: result };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
    }
    
    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('lista/:id_user')
    async obtenerImagenesPorUsuario(@Param('id_user') id_user: number) {
        try {
            const imagenes = await this.userImgService.ListarImgXIDUser(id_user);
            return imagenes;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }        
    }
}
