import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { AppConfig, isUrlConfig } from '../configuration/schemas';

@Module({
    imports: [
        MikroOrmModule.forRootAsync({
            inject: [ConfigService],
            driver: PostgreSqlDriver,
            useFactory: (configService: ConfigService<AppConfig, true>) => {
                const db = configService.get('database', { infer: true });

                return {
                    driver: PostgreSqlDriver,
                    autoLoadEntities: true,
                    debug: db.debug,
                    ...(isUrlConfig(db)
                        ? { clientUrl: db.url }
                        : {
                            host: db.host,
                            port: db.port,
                            dbName: db.databaseName,
                            user: db.username,
                            password: db.password,
                        }),
                };
            },
        }),
    ],
    exports: [],
})
export class DatabaseModule { }