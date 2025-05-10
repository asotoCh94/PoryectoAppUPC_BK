import { IsNotEmpty, IsString } from "class-validator";


export class UpdateImagenDto {

    nombre?: string;
    descripcion?: string;
    imagen?: string;

}