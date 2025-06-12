import { getDatabaseConnection } from "src/config/database.connection";


export async function insertImagen(imagen:any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows,fields] = await connection.execute(
        'INSERT INTO IMAGEN (vc_nombre,vc_descripcion,vc_imagen, vc_estado, dt_fec_reg) values (?,?,?,?,?)',
        [
            imagen.nombre,
            imagen.descripcion,
            imagen.imagen,
            'ACT',
            new Date()

        ]);
    return [rows,fields];
    
}

export async function findAllImagenes():Promise<any>{
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        'SELECT in_id_img,vc_nombre,vc_descripcion,vc_imagen FROM proyecto_app_upc.imagen;'
    );
    return rows;
}

export async function findImagenByID(id_img: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        'SELECT in_id_img,vc_nombre,vc_descripcion,vc_imagen FROM proyecto_app_upc.imagen WHERE in_id_img = ?',
        [id_img]
    );
    return rows.length > 0 ? rows[0] : null;
}

export async function deleteImagen(id: number): Promise<any> {
    const connection = await getDatabaseConnection();
    const [result] = await connection.execute(
        'DELETE FROM proyecto_app_upc.imagen WHERE in_id_img = ?',
        [id]
    );
    return result;
}

export async function updateImagen(id: number, imagen: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows, fields] = await connection.execute(
        `UPDATE proyecto_app_upc.imagen SET  vc_nombre = ?, vc_descripcion = ?, dt_fec_mod = ? WHERE in_id_img = ?`,
        [
            imagen.nombre,
            imagen.descripcion,
            new Date(),
            id              
        ]
    );
    return [rows, fields];
}

export async function updateImagenWhitImagen(id: number, imagen: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows, fields] = await connection.execute(
        `UPDATE proyecto_app_upc.imagen SET  vc_nombre = ?, vc_descripcion = ?,vc_imagen = ?, dt_fec_mod = ? WHERE in_id_img = ?`,
        [
            imagen.nombre,
            imagen.descripcion,
            imagen.imagen,
            new Date(),
            id
        ]
    );
    return [rows, fields];
}

export async function findImagenesPorLetras(letras: string[]): Promise<any[]> {
    const connection = await getDatabaseConnection();
    const placeholders = letras.map(() => '?').join(',');

    const [rows] = await connection.execute(
    `SELECT in_id_img, vc_nombre, vc_descripcion, vc_imagen
    FROM proyecto_app_upc.imagen
    WHERE UPPER(vc_nombre) IN (${placeholders}) AND vc_estado = 'ACT'`,
        letras
    );

    // Ordenar resultados manualmente según el orden original de 'letras'
    const mapa = new Map(rows.map((row: any) => [row.vc_nombre.toUpperCase(), row]));

    const ordenados = letras
        .map(letra => mapa.get(letra.toUpperCase()))
        .filter(img => img !== undefined); // eliminar letras que no existen en BD

    return ordenados;
}