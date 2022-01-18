import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../../auth/auth.module';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { RolesGaurd } from '../../auth/role/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from 'src/auth/otp/otp.module';
@Module({
  imports: [ 
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION),
    AuthModule,
    OtpModule
   ],
  controllers: [AppController],
  providers: [
    AppService,
  {
    provide: APP_GUARD,
    useClass:JwtAuthGuard
  },{
    provide: APP_GUARD,
    useClass: RolesGaurd
  }
],
})
export class AppModule {}
