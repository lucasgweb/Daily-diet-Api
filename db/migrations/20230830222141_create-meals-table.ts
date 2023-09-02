import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name').notNullable(),
    table.string('description').notNullable(),
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.boolean('isOnDiet').notNullable();
    table.uuid('userId').notNullable().index();
    table.foreign('userId').references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}

