import { Injectable, BadRequestException } from '@nestjs/common';
import { OAuthProvider } from './enums/oauth-provider.enum';
import { IOAuthProvider } from './interfaces/oauth-provider.interface';
import { GoogleOAuthProvider } from './providers/google-oauth-provider';

@Injectable()
export class OAuthService {
    private providers: Map<OAuthProvider, IOAuthProvider>;

    constructor(
        private googleProvider: GoogleOAuthProvider,
        // Inject more providers as needed
    ) {
        this.providers = new Map([
            [OAuthProvider.GOOGLE, this.googleProvider],
        ]);
    }

    getProvider(provider: OAuthProvider): IOAuthProvider {
        const oauthProvider = this.providers.get(provider);
        if (!oauthProvider) {
            throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
        }
        return oauthProvider;
    }

    getSupportedProviders(): OAuthProvider[] {
        return Array.from(this.providers.keys());
    }
}