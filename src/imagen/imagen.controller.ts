import { Body, Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImagenService } from './imagen.service';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { HasRoles } from 'src/config/jwt/has-roles';
import { JwtRol } from 'src/config/jwt/jwt-rol';
import { JwtAuthGuard } from 'src/config/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/config/jwt/jwt-roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('imagen')
export class ImagenController {
    constructor(private readonly imagenService: ImagenService){}

    @HasRoles(JwtRol.OPCION1, JwtRol.OPCION2, JwtRol.OPCION3)//proteccion conroles
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('register')
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
        @Body() imagen: CreateImagenDto
    ) {
        return this.imagenService.CreateImagen(file, imagen);
    }  

    @Get()
    findAllImagenes(){
        return this.imagenService.findAllImagenes();
    }
}
