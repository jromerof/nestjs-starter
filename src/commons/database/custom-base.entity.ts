import { Entity, Opt, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ abstract: true })
export abstract class CustomBaseEntity {
    @PrimaryKey()
    id!: number;

    @Property()
    createdAt: Opt<Date> = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Opt<Date> = new Date();
}