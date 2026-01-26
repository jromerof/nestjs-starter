import { z } from 'zod';

export const googleOAuthSchema = z.object({
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
    callbackUrl: z.url(),
});

export type GoogleOAuthConfig = z.infer<typeof googleOAuthSchema>;