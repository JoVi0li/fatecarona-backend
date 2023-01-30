import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import { userRoutes } from "./modules/user";
import { userCollegeRoutes } from "./modules/userCollege";
import { collegeRoutes } from "./modules/college";
import { courseRoutes } from "./modules/course";
import { userDocumentsRoutes } from "./modules/userDocuments";
import { userValidationsRoutes } from "./modules/userValidations";
import { eventRoutes } from "./modules/event";
import { participantRoutes } from "./modules/participant";

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
  const server = fastify({logger: true});

  server.register(fjwt, {
    secret: String(process.env.JWT_SECRET)
  });

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

  server.register(userValidationsRoutes, {prefix: 'api/uservalidations'});

  server.register(eventRoutes, { prefix: 'api/events' });

  server.register(participantRoutes, { prefix: 'api/participant' });

  try {
    await server.listen({
      port: Number(process.env.PORT),
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

buildServer();