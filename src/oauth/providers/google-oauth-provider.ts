import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { IOAuthProvider } from '../interfaces/oauth-provider.interface';
import { OAuthTokens } from '../types/oauth-tokens.type';
import { OAuthUserInfo } from '../types/oauth-user-info.type';
import { OAuthProvider } from '../enums/oauth-provider.enum';


@Injectable()
export class GoogleOAuthProvider implements IOAuthProvider {
    private client: OAuth2Client;
    private clientId: string;

    constructor(private configService: ConfigService) {
        const googleOauthConfig = this.configService.get('googleOauth', { infer: true });
        this.clientId = googleOauthConfig.clientId;
        this.client = new OAuth2Client(
            googleOauthConfig.clientId,
            googleOauthConfig.clientSecret,
            googleOauthConfig.callbackUrl,
        );
    }

    getAuthUrl(state: string): string {
        return this.client.generateAuthUrl({
            access_type: 'offline',
            scope: ['email', 'profile'],
            state,
        });
    }

    async exchangeCode(code: string): Promise<OAuthTokens> {
        const { tokens } = await this.client.getToken(code);
        return {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            idToken: tokens.id_token,
        };
    }

    async getUserInfo(tokens: OAuthTokens): Promise<OAuthUserInfo> {
        this.client.setCredentials({ access_token: tokens.accessToken });

        if (!tokens.idToken) {
            throw new Error('ID token is required to get user info');
        }

        const ticket = await this.client.verifyIdToken({
            idToken: tokens.idToken,
            audience: this.clientId,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error('Unable to retrieve user info from ID token');
        }

        if (!payload.email || !payload.sub || !payload.name) {
            throw new Error('Incomplete user info received from Google');
        }

        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            provider: OAuthProvider.GOOGLE,
        };
    }
}