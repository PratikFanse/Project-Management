import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Global()
@Module({  
  imports:[
    MailerModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: async (config:ConfigService) => ({
        transport:{
          host: config.get('MAIL_HOST'),
          port: new Number(config.get('MAIL_PORT')).valueOf(),
          auth:{
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS')
          }
        },
        defaults:{
          from: `"No Reply" <noreply@gmail.com>`,
        },
      }),
      inject:[ConfigService]
    })
  ],
  providers: [MailService],
  exports:[MailService],

})
export class MailModule {}
