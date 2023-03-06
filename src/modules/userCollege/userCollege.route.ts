import { FastifyInstance } from "fastify";
import { createUserCollegeHandler, deleteUserCollegeHandler, getUserCollegeHandler, updateUserCollegeRoleHandler } from "./userCollege.controller";

const userCollegeRoutes = async (server: FastifyInstance) => {
  server.post('/', { preHandler: [server.auth] }, createUserCollegeHandler);

  server.get('/', { preHandler: [server.auth] }, getUserCollegeHandler);

  server.delete('/', { preHandler: [server.auth] }, deleteUserCollegeHandler);

  server.patch('/', { preHandler: [server.auth] }, updateUserCollegeRoleHandler);
}

export { userCollegeRoutes };