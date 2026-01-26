import { Cascade, Collection, Entity, Enum, OneToMany, Property } from "@mikro-orm/core";
import { OAuthAccount } from "src/oauth/entities/oauth-account.entity";
import { AuthStatus } from "src/oauth/enums/auth-status.enum";
import { SoftDeleatableEntity } from "src/commons/database/soft-deleatable.entity";

@Entity()
export class User extends SoftDeleatableEntity {
    @Property()
    email!: string;

    @Enum(() => AuthStatus)
    @Property()
    authStatus: AuthStatus = AuthStatus.PENDING_VERIFICATION;

    @Property({ type: 'date', nullable: true })
    emailVerifiedAt: Date | null = null;

    @OneToMany(() => OAuthAccount, oauthAccount => oauthAccount.user, { cascade: [Cascade.REMOVE] })
    oauthAccounts = new Collection<OAuthAccount>(this);
}
