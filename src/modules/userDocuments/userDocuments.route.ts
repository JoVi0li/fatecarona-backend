import { FastifyInstance } from "fastify";
import {
  createUserDocumentsHandler,
  deleteUserDocumentsHandler,
  getUserDocumentsHandler,
  updateUserDocumentsHandler
} from ".";


const userDocumentsRoutes = async (server: FastifyInstance) => {
  server.post('/', { preHandler: [server.auth] }, createUserDocumentsHandler);

  server.get('/', { preHandler: [server.auth] }, getUserDocumentsHandler);

  server.delete('/', { preHandler: [server.auth] }, deleteUserDocumentsHandler);

  server.patch('/', { preHandler: [server.auth] }, updateUserDocumentsHandler);
}

export { userDocumentsRoutes };