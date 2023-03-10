import { FastifyInstance } from "fastify";
import { signInHandler, verifyUserEmailHandler } from "./auth.controller";

const authRoutes = async (server: FastifyInstance) => {
  server.post("/signin", signInHandler);
  
  server.get("/verifyemail/:id", verifyUserEmailHandler);
}

export default authRoutes;