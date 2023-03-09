import fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import fjwt, { JWT } from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { userRoutes } from "./modules/user";
import { collegeRoutes } from "./modules/college";
import { courseRoutes } from "./modules/course";
import { eventRoutes } from "./modules/event";
import { participantRoutes } from "./modules/participant";
import { userCollegeRoutes } from "./modules/userCollege";
import { userDocumentsRoutes } from "./modules/userDocuments";
import { authRoutes } from "./modules/auth";
import { TokenStatus } from "./shared/utils";

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
      status: TokenStatus
    }
  }
}

const buildServer = async () => {
  dotenv.config();

  const secret = process.env.JWT_SECRET!;
  const port = Number(process.env.PORT!);

  const server = fastify({ logger: true, bodyLimit: 30 * 1024 * 1024 });

  server.register(fjwt, {
    secret: secret
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

  server.register(userRoutes, { prefix: 'api/user' });

  server.register(userCollegeRoutes, { prefix: 'api/usercollege' });

  server.register(collegeRoutes, { prefix: 'api/college' });

  server.register(courseRoutes, { prefix: 'api/course' });

  server.register(userDocumentsRoutes, { prefix: 'api/userdocument' });

  server.register(eventRoutes, { prefix: 'api/event' });

  server.register(participantRoutes, { prefix: 'api/participant' });

  server.register(authRoutes, { prefix: 'api/auth' });

  try {
    await server.listen({
      port: port,
    });
    console.log(`Running on: ${port}`)
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

buildServer();