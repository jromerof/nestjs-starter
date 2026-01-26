import { OAuthTokens } from "../types/oauth-tokens.type";
import { OAuthUserInfo } from "../types/oauth-user-info.type";

export interface IOAuthProvider {
    getAuthUrl(state: string): string;
    exchangeCode(code: string): Promise<OAuthTokens>;
    getUserInfo(tokens: OAuthTokens): Promise<OAuthUserInfo>;
}