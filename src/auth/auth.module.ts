import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { MailModule } from 'src/mail/mail.module';
import { Occupation } from 'src/occupations/entities/occupation.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { SupportModule } from 'src/support/support.module';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordReset } from './entities/password-reset.entity';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { LocalAdminStrategy } from './passport-strategies/local-admin.strategy';
import { LocalSellerStrategy } from './passport-strategies/local-seller.strategy';
import { LocalStrategy } from './passport-strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Occupation,
      PasswordReset,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: configService.get('JWT_EXPIRATION_TIME')},
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/users',
        filename: filenameGenerator,
      })
    }),
    SupportModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalSellerStrategy, LocalAdminStrategy],
})
export class AuthModule {}
