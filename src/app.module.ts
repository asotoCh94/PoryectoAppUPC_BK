import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { databaseConfig } from './database.config';
import { RolesModule } from './roles/roles.module';
import { ImagenModule } from './imagen/imagen.module';
import { UserImgModule } from './user_img/user_img.module';
import * as mysql from 'mysql2/promise';
@Module({
  imports: [UsuarioModule, RolesModule, ImagenModule, UserImgModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    this.initDatabaseConnection();
  }
  async initDatabaseConnection() {
    try {
      const connection = await mysql.createConnection(databaseConfig);
      console.log('Conexión a la base de datos MySQL exitosa');
    } catch (error) {
      console.error('Error al conectar a la base de datos MySQL:', error);
    }
  }
}