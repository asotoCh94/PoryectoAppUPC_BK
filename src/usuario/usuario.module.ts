import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/config/jwt/jwt.strategy';
import { jwtConstants } from 'src/config/jwt/jwt.constanst';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsuarioService,JwtStrategy],
  controllers: [UsuarioController]
})
export class UsuarioModule {}
