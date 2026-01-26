import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { OauthModule } from './oauth/oauth.module';


@Module({
  imports: [ConfigurationModule, DatabaseModule, UsersModule, HealthModule, OauthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
