import { FastifyInstance } from "fastify";
import { createUserHandler, signinHandler } from "./user.controller";

const userRoutes = async (server: FastifyInstance) => {

  server.post('/', {preHandler: [server.auth  ]}, createUserHandler);

  server.post('/signin', {}, signinHandler)

}

export default userRoutes