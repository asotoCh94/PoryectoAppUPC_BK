import { Controller, Post, Body, HttpException, HttpStatus, Get, UseGuards, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsarioDto } from './dto/create-usuario.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/config/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/config/jwt/jwt-roles.guard';
import { HasRoles } from 'src/config/jwt/has-roles';
import { JwtRol } from 'src/config/jwt/jwt-rol';

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) { }

    @Post('register')
    async createUsuario(@Body() usuario: CreateUsarioDto) {
        try {
            const result = await this.usuarioService.createUsuario(usuario);
            return { message: 'Usuario creado correctamente', data: result };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
    }

    @Post('login')
    async login(@Body() loginData: LoginAuthDto) {
        try {
            return this.usuarioService.login(loginData);
            // const usuario = await this.usuarioService.login(loginData);
            // return { message: 'Inicio de sesión exitoso', data: usuario };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        }
    }

    @HasRoles(JwtRol.OPCION2)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get() // http://localhost/usuario GET
    findAll() {
        return this.usuarioService.findAll();
    }

    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('update/:id') // http://localhost/usuario/:id -> PUT
    async update(@Param('id', ParseIntPipe) id: number, @Body() usuario: UpdateUsuarioDto) {

        try {
            const updatedUsuario = await this.usuarioService.update(id, usuario);
            return updatedUsuario;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @HasRoles(JwtRol.OPCION2, JwtRol.OPCION3)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateEstado/:id') // http://localhost/usuario/:id -> PUT
    async updateEstado(@Param('id', ParseIntPipe) id: number, @Body() usuario: UpdateUsuarioDto) {

        try {
            const updatedUsuario = await this.usuarioService.updateEstado(id, usuario);
            return updatedUsuario;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)//proteccion conroles
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('updateWhitImage/:id')
    @UseInterceptors(FileInterceptor('file'))
    updateWhitImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),//tamaño en bit  maximo 10 megas
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number,
        @Body() usuario: UpdateUsuarioDto
    ) {
        return this.usuarioService.updateWithImage(file, id, usuario);
    }
}