import { FastifyInstance } from "fastify";
import { createEventHandler, getAvailableEventsHandler, getMyParticipantEvents, getOwnedEvents } from ".";

const eventRoutes = async (server: FastifyInstance) => {
  server.post('/', { preHandler: [server.auth] }, createEventHandler);

  server.get('/', { preHandler: [server.auth] }, getAvailableEventsHandler);

  server.get('/participant', { preHandler: [server.auth] }, getMyParticipantEvents);

  server.get('/owner', { preHandler: [server.auth] }, getOwnedEvents);
}

export default eventRoutes;