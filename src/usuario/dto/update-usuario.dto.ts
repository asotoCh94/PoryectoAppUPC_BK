import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateUsuarioDto {

    nombre?: string;
    apellido?: string;
    nrodoc?: string;
    telefono?: string;
    image?: string;
    notification_token?: string;

}
