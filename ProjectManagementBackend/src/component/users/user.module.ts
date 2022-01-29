import { forwardRef, Global, Module } from '@nestjs/common';
// import { DatabaseModule } from 'src/auth/db/database.module';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScema } from './models/user.model';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports:[forwardRef(() => AuthModule), 
    MongooseModule.forFeature([{name:'User', schema: UserScema}]),
],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}