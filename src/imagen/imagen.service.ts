import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { findAllImagenes, insertImagen } from './database/database.queries';
import storage = require('../utils/cloud_storage');

@Injectable()
export class ImagenService {

    async CreateImagen(file: Express.Multer.File, imagen: CreateImagenDto): Promise<any>{
        try {
            const url = await storage(file, file.originalname)

            if(url=== undefined && url === null){
                throw new HttpException('La imagen no se pudo guargar', HttpStatus.INTERNAL_SERVER_ERROR)
            }

            const [rows,fields] = await insertImagen({
                nombre: imagen.nombre,
                descripcion: imagen.descripcion,
                imagen: url
            });

            const imagenId = rows.insertId;
            const createImagen={
                id: imagenId,
                nombre:imagen.nombre,
                descripcion: imagen.descripcion,
                imagen: url
            };

            return createImagen;

        } catch (error) {
            throw new Error('Error al crear imagen' + error.message)
        }

    }


    async findAllImagenes(): Promise<any>{
        try {
            const imagenes = await findAllImagenes();
            const imagenesConRoles = [];
            for (const imagen of imagenes) {
                imagenesConRoles.push(imagen);
            }

            return imagenesConRoles;

        } catch (error) {
            
        }
    }

}
