import { IsNotEmpty, IsString } from "class-validator";


export class CreateImagenDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    imagen: string;

}