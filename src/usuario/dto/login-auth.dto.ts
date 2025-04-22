import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginAuthDto {
    
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'El email no es valido' })
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
    
}