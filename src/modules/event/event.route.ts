import { FastifyInstance } from "fastify";
import { createEventHandler, getActiveEventsHandler, getEventsWhereIAmOwnerHandler, getEventsWhereIAmParticipantHandler } from "./event.controller";

const eventRoutes = (server: FastifyInstance) => {
  server.post('/', { preHandler: [server.auth] }, createEventHandler);

  server.get('/', { preHandler: [server.auth] }, getActiveEventsHandler);

  server.get('/participant', { preHandler: [server.auth] }, getEventsWhereIAmParticipantHandler);

  server.get('/owner', { preHandler: [server.auth] }, getEventsWhereIAmOwnerHandler);
}

export default eventRoutes;