import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name').notNullable(),
    table.string('description').notNullable(),
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('dietary_compliance').notNullable();
    table.uuid('user_id').notNullable().index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}

