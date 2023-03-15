import fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import fjwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swaggerIo from "@fastify/swagger-ui";
import { userRoutes } from "../modules/user";
import { collegeRoutes } from "../modules/college";
import { courseRoutes } from "../modules/course";
import { eventRoutes } from "../modules/event";
import { participantRoutes } from "../modules/participant";
import { userCollegeRoutes } from "../modules/userCollege";
import { userDocumentsRoutes } from "../modules/userDocuments";
import { authRoutes } from "../modules/auth";

const buildServer = async () => {
  dotenv.config();

  const secret = process.env.JWT_SECRET!;
  const port = Number(process.env.PORT!);

  const server = fastify({ logger: true });

  server.register(fjwt, { secret: secret });

  server.register(multipart);

  server.register(swagger, {
    swagger: {
      info: {
        version: "1.0",
        title: "Fatecarona",
        description: "API Documentation",
        contact: {
          name: "João Vitor Oliveira",
          url: "https://github.com/JoVi0li",
          email: "jovi.oli04@gmail.com"
        },
        license: {
          name: "MIT"
        },
      },
      schemes: ["http", "https"],
      consumes: ["application/json", "multipart/form-data"],
      produces: ["application/json"]

    }
  });

  server.register(swaggerIo, { routePrefix: '/docs', });

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
    await server.ready();
    await server.listen({ port: port });
    server.swagger();
    console.log(`Running on: ${port}`)
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

buildServer();