import knex, { Knex } from "knex";
import { Entities } from "../entities";

export class Database {
  static instance: Database;
  client: Knex<any, unknown[]>;
  private constructor() {
    if (Database.instance == null) {
      Database.instance = this;
    }

    let connection = process.env.REPOST_DB_CONNECTION;

    try {
      connection = JSON.parse(process.env.REPOST_DB_CONNECTION)
    }catch (err) {}

    this.client = knex({
      client: process.env.REPOST_DB_CLIENT,
      connection,
      useNullAsDefault: true
    })

    Entities.forEach(async ent => {
      const hasTable = await this.client.schema.hasTable(ent.table);
      if (hasTable) { return; }
      await this.client.schema.createTable(ent.table, (t) => ent.createTable(t));
    });
  }

  static init() {
    return new Database();
  }
}
