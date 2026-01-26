import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { AuthController } from './oauth.controller';
import { GoogleOAuthProvider } from './providers/google-oauth-provider';
import { OAuthStateService } from './oauth-state.service';

@Module({
  providers: [OAuthService, OAuthStateService, GoogleOAuthProvider],
  controllers: [AuthController]
})
export class OauthModule { }
