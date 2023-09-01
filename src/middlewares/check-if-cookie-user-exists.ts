import { FastifyReply, FastifyRequest } from 'fastify';

export async function checkIfCookieUserExists(request: FastifyRequest, reply: FastifyReply) {
  const { userId } = request.cookies;

  if (!userId) {
    reply.status(401).send({
      message: 'Unauthorized',
    });
  }
}