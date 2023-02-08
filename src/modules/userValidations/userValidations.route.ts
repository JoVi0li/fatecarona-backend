import { FastifyInstance } from "fastify";
import { createUserValidationsHandler } from "./userValidations.controller";

const userValidationsRoutes = async (server: FastifyInstance) => {
  server.post('/', createUserValidationsHandler);
}

export default userValidationsRoutes;