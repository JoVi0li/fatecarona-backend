import { FastifyInstance } from "fastify";
import { createUserHandler, deleteUserHandler, getUserHandler, signinHandler, udpateUserHandler } from "./user.controller";

const userRoutes = async (server: FastifyInstance) => {

  server.post('/', createUserHandler);

  server.post('/signin', signinHandler);

  server.get('/', { preHandler: [server.auth] }, getUserHandler);

  server.delete('/', { preHandler: [server.auth] }, deleteUserHandler);

  server.patch('/', { preHandler: [server.auth] }, udpateUserHandler);

}

export default userRoutes;