import { z } from 'zod';

const databaseConnectionSchema = z.object({
    host: z.hostname(),
    port: z.number().int().min(1).max(65535),
    username: z.string().min(1),
    password: z.string().min(1),
})

const databaseUrlSchema = z.object({
    url: z.url(),
})


export const databaseConfigSchema = z.object({
    databaseName: z.string().min(1),
    ssl: z.boolean().optional().default(false),
    debug: z.boolean().optional().default(false),
}).and(databaseConnectionSchema.or(databaseUrlSchema))

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

export function isUrlConfig(config: DatabaseConfig): config is DatabaseConfig & { url: string } {
    return 'url' in config;
}