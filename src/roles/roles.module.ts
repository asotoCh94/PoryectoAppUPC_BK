import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { JwtStrategy } from 'src/config/jwt/jwt.strategy';

@Module({
  providers: [RolesService, JwtStrategy],
  controllers: [RolesController]
})
export class RolesModule {}
