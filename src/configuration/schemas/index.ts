import { z } from 'zod';
import { databaseConfigSchema } from './database.schema';
import { googleOAuthSchema } from './google-oauth.schema';
import { authSchema } from './auth.schema';


export const configSchema = z.object({
    database: databaseConfigSchema,
    googleOauth: googleOAuthSchema.optional(),
    auth: authSchema,
})

export type AppConfig = z.infer<typeof configSchema>;

export * from './database.schema';