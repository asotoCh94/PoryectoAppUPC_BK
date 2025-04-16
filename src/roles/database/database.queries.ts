import { getDatabaseConnection } from "src/config/database.connection";

export async function insertRol(rol: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows, fields] = await connection.execute(
        'INSERT INTO roles_app (VC_NOMBRE, VC_IMAGEN, VC_RUTA_PAGINA, DT_FEC_REG) VALUES (?, ?, ?, ?)',
        [
            rol.nombre,
            rol.image,
            rol.ruta_pagina,
            new Date()
        ]);
    return [rows, fields];;
}