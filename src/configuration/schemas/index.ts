import { z } from 'zod';
import { databaseConfigSchema } from './database.schema';


export const configSchema = z.object({
    database: databaseConfigSchema,
})

export type AppConfig = z.infer<typeof configSchema>;

export * from './database.schema';