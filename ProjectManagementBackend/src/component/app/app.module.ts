import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../../auth/auth.module';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { RolesGaurd } from '../../auth/role/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from 'src/auth/otp/otp.module';
import { TaskModule } from '../task/task.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ProjectModule } from '../project/project.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryModule } from '@ntegral/nestjs-sentry';
// import { LogLevel } from '@sentry/types';
@Module({
  imports: [ 
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION),
    AuthModule,
    OtpModule,TaskModule,ProjectModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'build'),
    }),
    SentryModule.forRoot({
      dsn:'https://f77c1355746b433aa3e830e0129c1e20@o1146959.ingest.sentry.io/6237472',
      // dsn: 'https://665b8276397e4380943d9fc7a58b5db4@o1146959.ingest.sentry.io/6216631',
      debug: true,
      attachStacktrace:true,
      environment: 'dev',
      release: 'aea134b27bc8e3a8a6ca34e8a410e4ac86284686' // must create a release in sentry.io dashboard
      // logLevel: LogLevel.Debug //based on sentry.io loglevel //
    })
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
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
