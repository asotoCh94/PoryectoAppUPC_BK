import { Injectable } from '@nestjs/common';
import { CreateUserImgDto } from './dto/create-user_img.dto';
import { findImagenByIDUser, findUserImg, insertUserImagen } from './database/database.queries';

@Injectable()
export class UserImgService {


    async InsertarUserImg(user_img: CreateUserImgDto): Promise<any> {
        try {

            const existingRows = await findUserImg(user_img.id_user, user_img.id_img);
            if (existingRows.length > 0) {
                throw new Error('La imagen ya esta asignado como favorito');
            } 

            const [rows, fields] = await insertUserImagen({
                id_user: user_img.id_user,
                id_img: user_img.id_img,
            });

            const IdUserImg = rows.insertId;

            const insertUserImg = {
                id: IdUserImg,
                id_user: user_img.id_user,
                id_img: user_img.id_img,
            };

            return insertUserImg;

        } catch (error) {
            throw new Error('Error al insertar detalle: ' + error.message);
        }
    }

    async ListarImgXIDUser(id_user: number): Promise<any[]> {
        try {
            const imagenes = await findImagenByIDUser(id_user);
            if (!imagenes || imagenes.length === 0) {
                throw new Error('No se encontraron imágenes para este usuario');
            }
            return imagenes;
        } catch (error) {
            throw new Error('Error al obtener imágenes: ' + error.message);
        }
    }

}
