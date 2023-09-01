import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/',async (request: FastifyRequest, reply: FastifyReply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    });

    const { name ,email } = createUserBodySchema.parse(request.body);

    const user = await knex('users').insert({
      name,
      email
    }).returning('*');

    reply.cookie('userId', user[0].id ,{
      path: '/',
      maxAge: 1000 * 60 * 60 * 7 // 7 days
    });

    reply.status(201).send();
  });
}
