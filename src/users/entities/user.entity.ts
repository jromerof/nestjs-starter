import { Entity, Property } from "@mikro-orm/core";
import { SoftDeleatableEntity } from "src/commons/database/soft-deleatable.entity";

@Entity()
export class User extends SoftDeleatableEntity {
    @Property()
    email!: string;
}
