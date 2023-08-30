import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('users');
}

