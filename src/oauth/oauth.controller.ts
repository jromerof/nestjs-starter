import { BadRequestException, Controller, Get, Param, Query, Res, } from '@nestjs/common';
import type { FastifyReply } from 'fastify'
import { OAuthProvider } from './enums/oauth-provider.enum';
import { OAuthService } from './oauth.service';
import { OAuthStateService } from './oauth-state.service';

@Controller('oauth')
export class AuthController {
    constructor(
        private readonly oauthService: OAuthService,
        private readonly oauthStateService: OAuthStateService
    ) { }

    @Get(':provider')
    async initiateOAuth(
        @Param('provider') provider: OAuthProvider,
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const oauthProvider = this.oauthService.getProvider(provider);
        const state = this.oauthStateService.generate(provider);

        reply.setCookie('oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 10 * 60,
        });

        const authUrl = oauthProvider.getAuthUrl(state);
        return reply.redirect(authUrl, 302);
    }

    @Get(':provider/callback')
    async handleCallback(
        @Param('provider') provider: OAuthProvider,
        @Query('code') code: string,
        @Query('error') error: string,
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        if (error) {
            throw new BadRequestException(`OAuth error: ${error}`);
        }

        if (!code) {
            throw new BadRequestException('Missing authorization code');
        }

        const oauthProvider = this.oauthService.getProvider(provider);
        const oauthTokens = await oauthProvider.exchangeCode(code);
        const userInfo = await oauthProvider.getUserInfo(oauthTokens);

        return userInfo;

        //const user = await this.userService.findOrCreateFromOAuth(userInfo);
        //const tokens = await this.authService.generateTokens(user);

        //this.authService.setAuthCookies(reply, tokens);

        // return {
        //     message: 'Authentication successful',
        //     user: {
        //         id: user.id,
        //         email: user.email,
        //         name: user.name,
        //     },
        // };
    }

    @Get('providers')
    getSupportedProviders() {
        return this.oauthService.getSupportedProviders();
    }
}
