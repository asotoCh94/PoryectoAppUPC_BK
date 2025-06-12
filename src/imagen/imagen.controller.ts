import { Body, Controller, Delete, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImagenService } from './imagen.service';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { HasRoles } from 'src/config/jwt/has-roles';
import { JwtRol } from 'src/config/jwt/jwt-rol';
import { JwtAuthGuard } from 'src/config/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/config/jwt/jwt-roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateImagenDto } from './dto/update-imagen.dto';

@Controller('imagen')
export class ImagenController {
    constructor(private readonly imagenService: ImagenService){}

    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)//proteccion conroles
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('register')
    @UseInterceptors(FileInterceptor('file'))
    registerWhitImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),//tamaño en bit  maximo 10 megas
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Body() imagen: CreateImagenDto
    ) {
        return this.imagenService.CreateImagen(file, imagen);
    }  

    @Get()
    findAllImagenes(){
        return this.imagenService.findAllImagenes();
    }

    @Delete('delete/:id')
    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    removeImagen(@Param('id', ParseIntPipe) id: number) {
        return this.imagenService.deleteImagen(id);
    }

    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('update/:id') // http://localhost/usuario/:id -> PUT
    async update(@Param('id', ParseIntPipe) id: number, @Body() usuario: UpdateImagenDto) {

        try {
            const updatedImagen = await this.imagenService.update(id, usuario);
            return updatedImagen;
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
        @Body() imagen: UpdateImagenDto
    ) {
        return this.imagenService.updateWithImage(file, id, imagen);
    }    

    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('traducir-texto/:texto')
    traducirTexto(@Param('texto') texto: string) {
        return this.imagenService.traducirTexto(texto);
    }
}
