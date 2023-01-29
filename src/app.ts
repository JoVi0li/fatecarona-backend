import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt, { JWT } from "@fastify/jwt";
import { userRoutes } from "./modules/user";
import { userCollegeRoutes } from "./modules/userCollege";
import { collegeRoutes } from "./modules/college";
import { courseRoutes } from "./modules/course";
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
  const server = fastify();

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

buildServer();