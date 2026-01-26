// oauth/oauth-state.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    randomBytes,
    createCipheriv,
    createDecipheriv,
    createHmac,
    timingSafeEqual,
    scryptSync,
} from 'crypto';

interface StatePayload {
    n: string; // nonce
    t: number;
    p: string; // provider
    r?: string; // redirect URL
}

@Injectable()
export class OAuthStateService {
    private readonly encryptionKey: Buffer;
    private readonly hmacKey: Buffer;
    private readonly ttlSeconds: number;
    private readonly algorithm = 'aes-256-gcm';

    constructor(private configService: ConfigService) {
        const authConfig = this.configService.get('auth', { infer: true });
        const oauthConfig = authConfig.oauth;
        const secret = oauthConfig.stateSecret;
        this.ttlSeconds = oauthConfig.stateTtlSeconds;

        this.encryptionKey = scryptSync(secret, 'oauth-state-encryption', 32);
        this.hmacKey = scryptSync(secret, 'oauth-state-hmac', 32);
    }

    generate = (provider: string, redirectUrl?: string): string => {
        const payload: StatePayload = {
            n: randomBytes(16).toString('hex'),
            t: Date.now(),
            p: provider,
            ...(redirectUrl && { r: redirectUrl }),
        };

        const plaintext = JSON.stringify(payload);

        const iv = randomBytes(12);
        const cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);

        const ciphertext = Buffer.concat([
            cipher.update(plaintext, 'utf8'),
            cipher.final(),
        ]);

        const authTag = cipher.getAuthTag();

        const encrypted = Buffer.concat([iv, ciphertext, authTag]);

        const hmac = createHmac('sha256', this.hmacKey)
            .update(encrypted)
            .digest();

        const token = Buffer.concat([encrypted, hmac]);

        return this.base64UrlEncode(token);
    }

    verify = (state: string, expectedProvider: string): StatePayload => {
        if (!state || typeof state !== 'string') {
            throw new BadRequestException('Missing state parameter');
        }

        let tokenBuffer: Buffer;
        try {
            tokenBuffer = this.base64UrlDecode(state);
        } catch {
            throw new BadRequestException('Invalid state encoding');
        }

        if (tokenBuffer.length < 61) {
            throw new BadRequestException('Invalid state format');
        }

        const hmacProvided = tokenBuffer.subarray(-32);
        const encrypted = tokenBuffer.subarray(0, -32);

        const hmacExpected = createHmac('sha256', this.hmacKey)
            .update(encrypted)
            .digest();

        if (!timingSafeEqual(hmacProvided, hmacExpected)) {
            throw new BadRequestException('Invalid state signature');
        }

        const iv = encrypted.subarray(0, 12);
        const authTag = encrypted.subarray(-16);
        const ciphertext = encrypted.subarray(12, -16);

        const plaintext = this.decrypt(iv, ciphertext, authTag);

        let payload = this.parsePayload(plaintext);

        if (!payload.n || !payload.t || !payload.p) {
            throw new BadRequestException('Incomplete state payload');
        }

        const age = Date.now() - payload.t;
        if (age > this.ttlSeconds * 1000) {
            throw new BadRequestException('State token expired');
        }

        if (age < -30000) {
            throw new BadRequestException('Invalid state timestamp');
        }

        if (payload.p !== expectedProvider) {
            throw new BadRequestException('State provider mismatch');
        }

        return payload;
    }

    private base64UrlEncode = (buffer: Buffer): string => {
        return buffer
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    private base64UrlDecode = (str: string): Buffer => {
        // Add back padding
        const padded = str + '==='.slice(0, (4 - (str.length % 4)) % 4);
        const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
        return Buffer.from(base64, 'base64');
    }

    private decrypt = (iv: Buffer, ciphertext: Buffer, authTag: Buffer): string => {
        try {
            const decipher = createDecipheriv(this.algorithm, this.encryptionKey, iv);
            decipher.setAuthTag(authTag);

            return Buffer.concat([
                decipher.update(ciphertext),
                decipher.final(),
            ]).toString('utf8');
        } catch {
            throw new BadRequestException('Invalid state token');
        }
    }

    private parsePayload = (plaintext: string): StatePayload => {
        try {
            return JSON.parse(plaintext);
        } catch {
            throw new BadRequestException('Invalid state payload');
        }
    }
}