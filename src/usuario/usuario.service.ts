import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise'; // Importa el módulo mysql2/promise
import { databaseConfig } from 'src/database.config';
import { CreateUsarioDto } from './dto/create-usuario.dto';
import { bryptAdapter } from 'src/config/bcrypt.adapter';
import { findAllUsuarios, findUsuarioByEmail, findUsuarioByID, findRolByUsuario, insertUser_x_Rol, insertUsuario, updateUsuario, updateUsuarioWhitImagen } from './database/database.queries';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import storage = require('../utils/cloud_storage');


@Injectable()
export class UsuarioService {
    constructor(
        private jwtService: JwtService
    ) { }

    async createUsuario(usuario: CreateUsarioDto): Promise<any> {
        try {
            const connection = await mysql.createConnection(databaseConfig);

            const requiredFields = ['prefix', 'nombre', 'apellido', 'nrodoc', 'email', 'telefono', 'password'];
            for (const field of requiredFields) {
                if (!usuario.hasOwnProperty(field) || usuario[field] === undefined) {
                    throw new Error(`Falta el campo requerido: ${field}`);
                }
            }

            const existingRows = await findUsuarioByEmail(usuario.email);
            if (existingRows.length > 0) {
                throw new Error('El email ya está registrado');
            }   
            usuario.password = bryptAdapter.hash(usuario.password);
            console.log('Entro aca2')
            const [rows, fields] = await insertUsuario({
                prefix: usuario.prefix,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                nrodoc: usuario.nrodoc,
                email: usuario.email,
                telefono: usuario.telefono,
                password: usuario.password,
            });
            
            const usuarioSave = await rows;

            const user = {
                id: usuarioSave.insertId, // Obtener el ID del Usuario insertado
                prefix: usuario.prefix,
                name: usuario.nombre,
                lastName: usuario.apellido,
                email: usuario.email,
                phone: usuario.telefono,  
                password: usuario.password,              
                created_at: new Date(), // Puedes asignar la fecha de creación si la tienes disponible
            };
            
            // Insertar registro en la tabla Usuario_HAS_ROLES
            await insertUser_x_Rol({
                ID_USER: usuarioSave.insertId, // ID_USER del Usuario recién creado
                ID_ROLES: 1, // Valor predeterminado para IN_ID_ROLES
            });

            const usuarioRoles = ["OPCION1"];
            const payload = { 
                id: usuarioSave.insertId, 
                name: user.prefix, 
                roles: usuarioRoles };
            const token = this.jwtService.sign(payload);
            const data = {
                usuario: user,
                token: 'Bearer ' + token
            }

            //no retornar el password
            delete data.usuario.password;

            return data;

        } catch (error) {
            throw new Error('Error al crear el usuaeio: ' + error.message);
        }
    }

    async login(loginData: LoginAuthDto): Promise<any> {
        const { email, password } = loginData;
        try {
            const connection = await mysql.createConnection(databaseConfig);
            const existingRows = await findUsuarioByEmail(email);
            if (existingRows.length === 0) {
                throw new Error('El email no está registrado');
            }
            const usuario = existingRows[0];
            const isPasswordValid = bryptAdapter.compare(password, usuario.VC_PASSWORD!);
            if (!isPasswordValid) {
                throw new Error('La contraseña es incorrecta');
            }

            const roles = await findRolByUsuario(usuario.IN_ID_USER);
            // Añadir los roles al objeto de Usuario
            usuario.roles = roles;

            const roleNames = roles.map(role => role.vc_nombre);
            const payload = { 
                id: usuario.IN_ID_USER, 
                name: usuario.VC_PREFIX,
                roles: roleNames 
            };
            const token = this.jwtService.sign(payload);
            const data = {
                usuario: usuario,
                //rol: roles,
                token: 'Bearer ' + token
            }

            //no retornar el password
            delete data.usuario.VC_PASSWORD;

            return data;
        } catch (error) {
            throw new Error('Error al iniciar sesión: ' + error.message);
        }
    }

    async findAll(): Promise<any> {
        try {
            const usuarios = await findAllUsuarios();

            const usuariosConRoles = [];
            for (const usuario of usuarios) {
                const roles = await findRolByUsuario(usuario.IN_ID_USER);
                // Añadir los roles al objeto de Usuario
                usuario.roles = roles;
                usuariosConRoles.push(usuario);
            }
            
            return usuariosConRoles;
        } catch (error) {
            throw new Error('Error al obtener todos los usuarios: ' + error.message);
        }
    }

    async update(id: number, usuario: UpdateUsuarioDto): Promise<any> {
        try {
            const connection = await mysql.createConnection(databaseConfig);

            const [rows, fields] = await updateUsuario(id, usuario);

            if (rows.affectedRows === 0) {
                throw new Error('Usuario no encontrado');
            }
            const updatedUsuario = await findUsuarioByID(id);

            if (!updatedUsuario) {
                throw new Error('Usuario no encontrado');
            }

            return updatedUsuario;
        } catch (error) {
            throw new Error('Error al actualizar usuario: ' + error.message);
        }
    }

    async updateWithImage(file: Express.Multer.File, id: number, usuario: UpdateUsuarioDto) {
        try {
            const url = await storage(file, file.originalname);
            console.log('URL: ' + url);

            if (url === undefined && url === null) {
                return new HttpException('La imagen no se guardo', HttpStatus.INTERNAL_SERVER_ERROR);//error en el servidor
            }
            const connection = await mysql.createConnection(databaseConfig);
            usuario.image = url;
            const [rows, fields] = await updateUsuarioWhitImagen(id, usuario);
            if (rows.affectedRows === 0) {
                throw new Error('Usuario no encontrado');
            }

            const updatedUsuario = await findUsuarioByID(id);
            if (!updatedUsuario) {
                throw new Error('Usuario no encontrado');
            }

            return updatedUsuario;
        } catch (error) {
            throw new Error('Error al actualizar usuario: ' + error.message);
        }
    }
}