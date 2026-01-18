import { Migration } from '@mikro-orm/migrations';

export class Migration20260118192735 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null);`);
  }

}
