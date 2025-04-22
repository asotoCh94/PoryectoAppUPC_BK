import { Module } from '@nestjs/common';
import { ImagenService } from './imagen.service';
import { ImagenController } from './imagen.controller';
import { JwtStrategy } from 'src/config/jwt/jwt.strategy';

@Module({
  providers: [ImagenService, JwtStrategy],
  controllers: [ImagenController]
})
export class ImagenModule {}
