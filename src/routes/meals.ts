import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { checkUserIdExists } from '../middlewares/check-user-id-exists';

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dietaryCompliance: z.boolean(),
      });

      const { description, dietaryCompliance, name } =
        createMealBodySchema.parse(request.body);

      const userId = request.cookies.userId;

      await knex('meals').insert({
        name,
        description,
        dietary_compliance: dietaryCompliance,
        user_id: userId,
      });

      reply.status(201).send();
    }
  );

  app.get(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.cookies.userId;

      const meals = await knex('meals').where('user_id', userId).select();

      reply.status(200).send(meals);
    }
  );

  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealParamsSchema.parse(request.params);

      const { userId } = request.cookies;

      const meal = await knex('meals')
        .where({
          user_id: userId,
          id,
        })
        .select()
        .first();

      reply.status(200).send(meal);
    }
  );

  app.delete(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const deleteMealParamsSchema = z.object({
        id: z.string().uuid(),
      });
      const { id } = deleteMealParamsSchema.parse(request.params);

      const { userId } = request.cookies;

      await knex('meals').where({ id, user_id: userId }).delete();

      reply.status(200).send();
    }
  );

  app.put(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dietaryCompliance: z.boolean(),
      });

      const updateMealParamSchema = z.object({
        id: z.string().uuid(),
      });

      const { description, dietaryCompliance, name } =
        updateMealBodySchema.parse(request.body);

      const { id } = updateMealParamSchema.parse(request.params);

      const { userId } = request.cookies;

      await knex('meals')
        .update({
          name,
          description,
          dietary_compliance: dietaryCompliance,
        })
        .where({
          id,
          user_id: userId,
        });

      reply.status(200).send();
    }
  );

  app.get(
    '/summary',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.cookies.userId;

      const meals = await knex('meals').where('user_id', userId).select();

      const totalMealsRecorded = meals.length;
      const mealsWithinDiet = meals.filter(
        (meal) => meal.dietary_compliance == true
      );

      const totalMealsOutsideDiet = totalMealsRecorded - mealsWithinDiet.length;

      let currentSequence = [];
      let bestSequenceOfMealsWithinDiet: typeof meals = [];

      for (const meal of meals) {
        if (meal.dietary_compliance == true) {
          currentSequence.push(meal);
          if (currentSequence.length > bestSequenceOfMealsWithinDiet.length) {
            bestSequenceOfMealsWithinDiet = [...currentSequence];
          }
        } else {
          currentSequence = [];
        }
      }

      reply.status(200).send({
        totalMealsRecorded,
        totalMealsWithinDiet: mealsWithinDiet.length,
        totalMealsOutsideDiet,
        bestSequenceOfMealsWithinDiet
      });
    }
  );
}
