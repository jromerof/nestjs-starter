import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configSchema } from "./schemas";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (config) => {
                return configSchema.parse(({
                    database: {
                        ...(config.DATABASE_URL && { url: config.DATABASE_URL }),
                        host: config.DB_HOST,
                        port: Number(config.DB_PORT),
                        databaseName: config.DB_NAME,
                        username: config.DB_USER,
                        password: config.DB_PASSWORD,
                        ssl: config.DB_SSL === 'true',
                        debug: config.DB_DEBUG === 'true',
                    }
                }));
            }
        })
    ],
    exports: [ConfigModule],
})

export class ConfigurationModule {}