import { FastifyInstance } from "fastify";
import { createUserDocumentsHandler, deleteUserDocumentsHandler, getUserDocumentsHandler, updateUserDocumentsHandler } from "./userDocuments.controller";


const userDocumentsRoutes = async (server: FastifyInstance) => {
  server.post('/', createUserDocumentsHandler);

  server.get('/', { preHandler: [server.auth] }, getUserDocumentsHandler);

  server.delete('/', { preHandler: [server.auth] }, deleteUserDocumentsHandler);

  server.patch('/', { preHandler: [server.auth] }, updateUserDocumentsHandler);
}

export default userDocumentsRoutes;