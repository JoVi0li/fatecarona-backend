import { FastifyInstance } from "fastify";
import { createCourseHandler, getCourseHandler, getAllCoursesHandler, deleteCourseHandler, updateCourseHandler } from ".";

const courseRoutes = async (server: FastifyInstance) => {
  server.post('/', {preHandler: [server.auth]}, createCourseHandler);

  server.get('/', {preHandler: [server.auth]}, getCourseHandler);

  server.get('/all', getAllCoursesHandler);

  server.delete('/:id', { preHandler: [server.auth] }, deleteCourseHandler);

  server.patch('/:id', { preHandler: [server.auth] }, updateCourseHandler);
}

export default courseRoutes;