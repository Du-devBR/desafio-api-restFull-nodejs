import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", (table) => {
    table.uuid("id").primary();
    table.text("name").notNullable();
    table.text("lastname").notNullable();
    table.text("email").notNullable();
    table.text("hashPassword").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("user");
}
