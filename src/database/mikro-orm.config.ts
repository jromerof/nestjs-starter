import 'dotenv/config';
import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { databaseConfigSchema, isUrlConfig } from '../configuration/schemas/database.schema';

const dbConfig = databaseConfigSchema.parse({
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true',
  debug: process.env.DB_DEBUG === 'true',
});

const baseConfig: Options = {
  driver: PostgreSqlDriver,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  debug: dbConfig.debug,
  driverOptions: dbConfig.ssl
    ? { connection: { ssl: { rejectUnauthorized: false } } }
    : {},
  extensions: [Migrator],
  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
  },
};

const config: Options = isUrlConfig(dbConfig)
  ? { ...baseConfig, clientUrl: dbConfig.url }
  : {
      ...baseConfig,
      host: dbConfig.host,
      port: dbConfig.port,
      dbName: dbConfig.databaseName,
      user: dbConfig.username,
      password: dbConfig.password,
    };

export default config;