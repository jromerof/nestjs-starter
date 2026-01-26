import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configSchema } from "./schemas";


const oauthConfigs = () => {
    const hasGoogleOauth = process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CALLBACK_URL;
    return {
        ...(hasGoogleOauth && {
            googleOauth: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackUrl: process.env.GOOGLE_CALLBACK_URL,
            }
        })
    };
}

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
                    },
                    auth: {
                        jwt: {
                            secret: config.JWT_SECRET,
                            accessExpiresIn: config.JWT_ACCESS_EXPIRES_IN,
                            refreshExpiresIn: config.JWT_REFRESH_EXPIRES_IN,
                        },
                        oauth: {
                            stateSecret: config.OAUTH_STATE_SECRET,
                            stateTtlSeconds: config.OAUTH_STATE_TTL_SECONDS && Number(config.OAUTH_STATE_TTL_SECONDS),
                        },
                        cookie: {
                            domain: config.COOKIE_DOMAIN,
                            secure: config.COOKIE_SECURE === 'true',
                            sameSite: config.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none',
                        },
                    },
                    ...oauthConfigs(),
                }));
            }
        })
    ],
    exports: [ConfigModule],
})

export class ConfigurationModule { }