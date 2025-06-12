import * as mysql from 'mysql2/promise';
import { getDatabaseConnection } from 'src/config/database.connection';
import { databaseConfig } from 'src/database.config';

export async function findUsuarioByEmail(email: string): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        'SELECT IN_ID_USER, VC_PREFIX, VC_NOMBRE, VC_APELLIDO, VC_NRODOC, VC_EMAIL, VC_TELEFONO, VC_PASSWORD, VC_TOKEN,VC_FOTO,VC_ESTADO FROM USUARIO WHERE VC_EMAIL = ?',
        [email]
    );
    return rows;
}
/*
export async function findUsuarioByID(ID_USER: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        'SELECT IN_ID_USER, VC_PREFIX, VC_NOMBRE, VC_APELLIDO, VC_NRODOC, VC_EMAIL, VC_TELEFONO, VC_PASSWORD, VC_TOKEN,VC_FOTO FROM USUARIO WHERE IN_ID_USER = ?',
        [ID_USER]
    );
    return rows;
}*/

export async function findUsuarioByID(ID_USER: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        'SELECT IN_ID_USER, VC_PREFIX, VC_NOMBRE, VC_APELLIDO, VC_NRODOC, VC_EMAIL, VC_TELEFONO, VC_PASSWORD, VC_TOKEN,VC_FOTO,VC_ESTADO FROM USUARIO WHERE IN_ID_USER = ?',
        [ID_USER]
    );
    // Devuelve el primer elemento del arreglo o null si no hay elementos
    return rows.length > 0 ? rows[0] : null;
}

export async function findRolByUsuario(id: string): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        'select e.in_id_roles,r.vc_nombre,r.vc_imagen,r.vc_ruta_pagina from usuario_has_roles e join roles_app r on e.in_id_roles = r.in_id_roles where IN_ID_USER = ?',
        [id]
    );
    return rows;
}

export async function insertUsuario(usuario: any): Promise<any> {
    const connection = await getDatabaseConnection();

    const [rows, fields] = await connection.execute(
        'INSERT INTO USUARIO (VC_PREFIX, VC_NOMBRE, VC_APELLIDO, VC_NRODOC, VC_EMAIL, VC_TELEFONO, VC_PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
            usuario.prefix,
            usuario.nombre,
            usuario.apellido,
            usuario.nrodoc,
            usuario.email,
            usuario.telefono,
            usuario.password,
    ]);
    return  [rows, fields];;
}

export async function insertUser_x_Rol(usuario: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows, fields] = await connection.execute(
        'INSERT INTO USUARIO_HAS_ROLES (IN_ID_USER,IN_ID_ROLES,DT_FEC_REG) VALUES (?, ?, ?)',
        [
            usuario.ID_USER,
            usuario.ID_ROLES,
            new Date()
        ]);
    return [rows, fields];;
}

export async function findAllUsuarios(): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        `SELECT u.IN_ID_USER, u.VC_PREFIX, u.VC_NOMBRE, u.VC_APELLIDO, 
                u.VC_NRODOC, u.VC_EMAIL, u.VC_TELEFONO, u.VC_FOTO, u.VC_TOKEN, u.VC_ESTADO
        FROM usuario u
        WHERE u.IN_ID_USER NOT IN (
            SELECT ur.IN_ID_USER
            FROM usuario_has_roles ur
            JOIN roles_app r ON ur.IN_ID_ROLES = r.IN_ID_ROLES
            WHERE r.VC_NOMBRE = 'ADMIN'
        )`
    );
    return rows;
}

export async function findAllEmailUsuarios(): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        `SELECT u.IN_ID_USER, u.VC_EMAIL
        FROM usuario u
        WHERE u.IN_ID_USER NOT IN (
            SELECT ur.IN_ID_USER
            FROM usuario_has_roles ur
            JOIN roles_app r ON ur.IN_ID_ROLES = r.IN_ID_ROLES
            WHERE r.VC_NOMBRE = 'ADMIN'
        ) and VC_ESTADO ='ACT'`
    );
    return rows;
}

export async function updateUsuario(id: number, usuario: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows, fields] = await connection.execute(
        `UPDATE USUARIO SET  VC_NOMBRE = ?, VC_APELLIDO = ?, VC_TELEFONO = ? WHERE IN_ID_USER = ?`,
        [usuario.nombre, usuario.apellido, usuario.telefono, id]
    );
    return [rows, fields];
}

export async function updateEstadoUsuario(id: number, usuario: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows, fields] = await connection.execute(
        `UPDATE USUARIO SET  VC_ESTADO = ?, VC_USER_MOD = ?, DT_FEC_MOD = ? WHERE IN_ID_USER = ?`,
        [usuario.estado, usuario.prefix, new Date(), id]
    );
    return [rows, fields];
}

export async function updateUsuarioWhitImagen(id: number, usuario: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows, fields] = await connection.execute(
        `UPDATE USUARIO SET  VC_NOMBRE = ?, VC_APELLIDO = ?, VC_TELEFONO = ?, VC_FOTO = ? WHERE IN_ID_USER = ?`,
        [usuario.nombre, usuario.apellido, usuario.telefono, usuario.image, id]
    );
    return [rows, fields];
}