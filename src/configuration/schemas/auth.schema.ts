import { z } from 'zod';

export const authSchema = z.object({
    jwt: z.object({
        accessExpiresIn: z.string().min(1).default('15m'),
        refreshExpiresIn: z.string().min(1).default('7d'),
        secret: z.string().min(32),
    }),
    oauth: z.object({
        stateSecret: z.string().min(32),
        stateTtlSeconds: z.number().min(60).default(300),
    }),
    cookie: z.object({
        domain: z.string().optional(),
        secure: z.boolean().default(true),
        sameSite: z.enum(['lax', 'strict', 'none']).default('lax'),
    }),
});

export type AuthConfig = z.infer<typeof authSchema>;