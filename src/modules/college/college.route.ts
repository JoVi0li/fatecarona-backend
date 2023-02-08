import { FastifyInstance } from "fastify";
import { createCollegeHandler, deleteCollegeHandler, getAllCollegesHandler, getCollegeHandler, updateCollegeHandler } from "./college.controller";

const collegeRoutes = async (server: FastifyInstance) => {

  server.post('/', { preHandler: [server.auth] }, createCollegeHandler);

  server.get('/', {preHandler: [server.auth]}, getCollegeHandler);

  server.get('/all', getAllCollegesHandler);
  
  server.delete('/:id', { preHandler: [server.auth] }, deleteCollegeHandler);

  server.patch('/:id', { preHandler: [server.auth] }, updateCollegeHandler );
}

export default collegeRoutes;