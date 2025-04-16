import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUsarioDto {
    @IsNotEmpty()
    @IsString()   
    prefix: string;

    @IsNotEmpty()
    @IsString()   
    nombre: string;

    @IsNotEmpty()
    @IsString()   
    apellido: string;

    @IsNotEmpty()
    @IsString()   
    nrodoc: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'El email no es valido' })
    email: string;

    @IsNotEmpty()
    @IsString()   
    telefono: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener minimo 6 caracteres' })
    password: string;

    image?: string;
    notification_token?: string;

}
