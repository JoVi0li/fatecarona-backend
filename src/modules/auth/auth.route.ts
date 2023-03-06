import { FastifyInstance } from "fastify";
import { signinHandler, verifyEmailHandler } from "./auth.controller";

const authRoutes = async (server: FastifyInstance) => {
  server.post("/signin", signinHandler);
  
  server.get("/verifyemail/:id", verifyEmailHandler);
}

export default authRoutes;