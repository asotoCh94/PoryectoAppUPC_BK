import { Module } from '@nestjs/common';
import { UserImgService } from './user_img.service';
import { UserImgController } from './user_img.controller';
import { JwtStrategy } from 'src/config/jwt/jwt.strategy';

@Module({
  providers: [UserImgService, JwtStrategy],
  controllers: [UserImgController]
})
export class UserImgModule {}
