import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateUserImgDto {

    @IsNotEmpty()
    @IsNumber()
    id_user: number;

    @IsNotEmpty()
    @IsNumber()
    id_img: number;

    estado?: string;

}