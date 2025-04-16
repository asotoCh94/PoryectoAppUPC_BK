import { IsNotEmpty, IsString } from "class-validator";


export class CreateRolDto {

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsString()
    ruta_pagina: string;


}