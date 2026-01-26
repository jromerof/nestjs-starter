import { Entity, Enum, Index, ManyToOne, Property, Unique } from "@mikro-orm/core";
import { CustomBaseEntity } from "src/commons/database/custom-base.entity";
import { User } from "src/users/entities/user.entity";
import { OAuthProvider } from "../enums/oauth-provider.enum";

@Entity()
@Index({ properties: ['provider', 'providerUserId'] })
@Unique({ properties: ['provider', 'providerUserId'] })
export class OAuthAccount extends CustomBaseEntity {
    @ManyToOne(() => User)
    user: User | undefined;

    @Enum(() => OAuthProvider)
    @Property()
    provider!: OAuthProvider;

    @Property({ type: 'string', length: 255 })
    providerUserId!: string;

    @Property({ type: 'string', length: 255 })
    providerEmail!: string;

    @Property({ type: 'string', length: 255 })
    providerName!: string;

    @Property({ type: 'string', length: 500, nullable: true })
    providerAvatar: string | null = null;

    @Property({ type: 'date' })
    connectedAt: Date = new Date();

    @Property({ type: 'date' })
    lastUsedAt: Date = new Date();
}