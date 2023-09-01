import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { checkIfCookieUserExists } from '../middlewares/check-if-cookie-user-exists';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', {
    preHandler: [checkIfCookieUserExists]
  },async (request: FastifyRequest, reply: FastifyReply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dietaryCompliance: z.boolean(),
    });

    const {description,dietaryCompliance,name} = createMealBodySchema.parse(request.body);

    const userId = request.cookies.userId;

    await knex('meals').insert({
      name,
      description,
      dietary_compliance: dietaryCompliance,
      user_id: userId
    });

    reply.status(201).send();
  });
}