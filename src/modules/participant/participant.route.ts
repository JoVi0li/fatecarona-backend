import { FastifyInstance } from "fastify";
import { createParticipantHandler, disableParticipantHandler } from ".";

const participantRoutes = async (server: FastifyInstance) => {
  server.post('/', { preHandler: [server.auth] }, createParticipantHandler);

  server.patch('/disable/:id', { preHandler: [server.auth] }, disableParticipantHandler);
}

export default participantRoutes;