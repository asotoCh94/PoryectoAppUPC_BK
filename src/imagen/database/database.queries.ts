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