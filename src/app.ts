import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from "@fastify/jwt";
import { userRoutes } from "./modules/user";

export const server = fastify();

declare module "fastify" {
  export interface FastifyInstance {
    auth: any
  }
}

server.register(fjwt, {
  secret: String(process.env.JWT_SECRET)
});

server.decorate("auth", async (req: FastifyRequest, res: FastifyReply) => {
  try {
    await req.jwtVerify()
    
  } catch (error) {
    return res.send(error);
  }
})

const main = async () => {

  server.register(userRoutes, {prefix: 'api/users'});
  try {
    await server.listen({
      port: 3000,
      
    });
    console.log("Server running at http://localhost:3000")
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();