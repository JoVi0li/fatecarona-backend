import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { userRoutes } from "./modules/user";
import { collegeRoutes } from "./modules/college";
import { courseRoutes } from "./modules/course";
import { eventRoutes } from "./modules/event";
import { participantRoutes } from "./modules/participant";
import { userCollegeRoutes } from "./modules/userCollege";
import { userDocumentsRoutes } from "./modules/userDocuments";

declare module "fastify" {
  export interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    auth: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      userId: string;
      studentId: string;
      courseId: string;
      email: string;
      name: string;
      role: string;
    }
  }
}

const buildServer = async () => {
  const server = fastify({ logger: true, bodyLimit: 30 * 1024 * 1024 });

  server.register(fjwt, {
    secret: String(process.env.JWT_SECRET)
  });

  server.register(multipart);

  server.decorate(
    "auth",
    async (
      req: FastifyRequest,
      res: FastifyReply
    ): Promise<void> => {
      try {
        await req.jwtVerify();
      } catch (error) {
        return res.send(error);
      }
    }
  );

  server.addHook(
    "preHandler",
    (req, res, next) => {
      req.jwt = server.jwt;
      return next();
    }
  );

  server.register(userRoutes, { prefix: 'api/users' });

  server.register(userCollegeRoutes, { prefix: 'api/usercolleges' });

  server.register(collegeRoutes, { prefix: 'api/colleges' });

  server.register(courseRoutes, { prefix: 'api/courses' });

  server.register(userDocumentsRoutes, { prefix: 'api/userdocuments' });

  server.register(eventRoutes, { prefix: 'api/events' });

  server.register(participantRoutes, { prefix: 'api/participant' });

  try {
    await server.listen({
      port: Number(process.env.PORT),
    });
    console.log(process.env.PORT)
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

buildServer();