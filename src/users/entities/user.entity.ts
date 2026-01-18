import { Entity, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "src/commons/database/custom-base.entity";

@Entity()
export class User extends CustomBaseEntity {
    @Property()
    email!: string;
}
