import { OAuthProvider } from "../enums/oauth-provider.enum";

export type OAuthUserInfo = {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider: OAuthProvider;
}