import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { deleteImagen, findAllImagenes, findImagenByID, insertImagen, updateImagen, updateImagenWhitImagen } from './database/database.queries';
import * as mysql from 'mysql2/promise';
import storage = require('../utils/cloud_storage');
import { UpdateImagenDto } from './dto/update-imagen.dto';
import { databaseConfig } from 'src/database.config';

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

    async deleteImagen(id: number): Promise<any> {
        try {
            const result = await deleteImagen(id);

            if (result.affectedRows === 0) {
                throw new HttpException('Imagen no encontrada', HttpStatus.NOT_FOUND);
            }

            return { message: `Imagen con id ${id} eliminada correctamente` };
        } catch (error) {
            throw new HttpException('Error al eliminar imagen: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: number, imagen: UpdateImagenDto): Promise<any> {
            try {
                const connection = await mysql.createConnection(databaseConfig);
    
                const [rows, fields] = await updateImagen(id, imagen);
    
                if (rows.affectedRows === 0) {
                    throw new Error('Imagen no encontrado');
                }
                const updatedImagen = await findImagenByID(id);
    
                if (!updatedImagen) {
                    throw new Error('Imagen no encontrado');
                }
    
                return updatedImagen;
            } catch (error) {
                throw new Error('Error al actualizar imagen: ' + error.message);
            }
        }
    
    async updateWithImage(file: Express.Multer.File, id: number, imagen: UpdateImagenDto) {
            try {
                const url = await storage(file, file.originalname);
                console.log('URL: ' + url);
    
                if (url === undefined && url === null) {
                    return new HttpException('La imagen no se guardo', HttpStatus.INTERNAL_SERVER_ERROR);//error en el servidor
                }
                const connection = await mysql.createConnection(databaseConfig);
                imagen.imagen = url;
                const [rows, fields] = await updateImagenWhitImagen(id, imagen);
                if (rows.affectedRows === 0) {
                    throw new Error('Imagen no encontrado');
                }
    
                const updatedImagen = await findImagenByID(id);
                if (!updatedImagen) {
                    throw new Error('g no encontrado');
                }
    
                return updatedImagen;
            } catch (error) {
                throw new Error('Error al actualizar imagen: ' + error.message);
            }
        }
    

}
