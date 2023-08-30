import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable(),
    table.string('description').notNullable(),
    table.timestamp('created_at').defaultTo(knex.fn.now);
    table.boolean('dietary_compliance').notNullable();
    table.uuid('user_id').notNullable().index();
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('meals');
}

