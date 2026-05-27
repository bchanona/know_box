import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import {envValidationSchema} from "./config/validation/join.validation";
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';


@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true,
      envFilePath: '.env.development',
      load:[
        databaseConfig,
      ],
      validationSchema: envValidationSchema

    }
  ),
    DatabaseModule,
    AuthModule,
    FilesModule,
  
],
})
export class AppModule {}
