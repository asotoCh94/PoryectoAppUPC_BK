import { getDatabaseConnection } from "src/config/database.connection";


export async function insertUserImagen(user_img:any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows,fields] = await connection.execute(
        'INSERT INTO usuario_has_imagen (in_id_user,in_id_img,vc_estado, dt_fec_reg) values (?,?,?,?)',
        [
            user_img.id_user,
            user_img.id_img,
            'ACT',
            new Date()

        ]);
    return [rows,fields];
    
}

export async function findUserImg(id_user: number, id_img: number): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        'select in_id_usuario_has_imagen,in_id_user,in_id_img,vc_estado from  proyecto_app_upc.usuario_has_imagen where in_id_user = ? and in_id_img = ?',
        [id_user, id_img]
    );
    return rows;
}

export async function findImagenByIDUser(id_user: any): Promise<any> {
    const connection = await getDatabaseConnection();
    const [rows] = await connection.execute(
        `select i.in_id_img,i.vc_nombre,i.vc_descripcion,i.vc_imagen from proyecto_app_upc.usuario_has_imagen ui
        left join proyecto_app_upc.imagen i on ui.in_id_img = i.in_id_img where ui.in_id_user = ? and ui.vc_estado = 'ACT'`,
        [id_user]
    );
    return rows;
}
