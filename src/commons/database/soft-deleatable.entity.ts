import { Entity, Filter, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({ abstract: true })
@Filter({ name: 'softDelete', cond: { deletedAt: null }, default: true })
export abstract class SoftDeleatableEntity extends CustomBaseEntity {
    @Property({ nullable: true })
    deletedAt: Date | null = null;

    softDelete() {
        this.deletedAt = new Date();
    }

    restore() {
        this.deletedAt = null;
    }
}