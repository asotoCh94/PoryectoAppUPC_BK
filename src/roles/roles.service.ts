import { Injectable } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { insertRol } from './database/database.queries';

@Injectable()
export class RolesService {

    async createRol(rol: CreateRolDto): Promise<any> {
        try {

            const [rows, fields] = await insertRol({
                nombre: rol.nombre,
                image: rol.image,
                ruta_pagina: rol.ruta_pagina,
            });

            const rolId = rows.insertId;

            const createdRol = {
                id: rolId,
                nombre: rol.nombre,
                image: rol.image,
                ruta_pagina: rol.ruta_pagina,
            };

            return createdRol;

        } catch (error) {
            throw new Error('Error al crear el rol: ' + error.message);
        }
    }
}
