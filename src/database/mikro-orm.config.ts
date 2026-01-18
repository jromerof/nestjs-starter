import 'dotenv/config';
import { Options, PostgreSqlDriver, UnderscoreNamingStrategy } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { databaseConfigSchema, isUrlConfig } from '../configuration/schemas/database.schema';


const commonEnvs = {
  ssl: process.env.DB_SSL === 'true',
  debug: process.env.DB_DEBUG === 'true',
  databaseName: process.env.DB_NAME,
}

const connectionEnvs = process.env.DATABASE_URL ? {
  url: process.env.DATABASE_URL,
} : {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};


const dbConfig = databaseConfigSchema.parse({
  ...commonEnvs,
  ...connectionEnvs,
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
  namingStrategy: UnderscoreNamingStrategy,
  seeder: {
    path: './dist/database/seeders',
    pathTs: './src/database/seeders',
    defaultSeeder: 'DatabaseSeeder',
  }
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