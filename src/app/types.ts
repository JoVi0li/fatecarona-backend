import { JWT } from "@fastify/jwt";
import { TokenStatus } from "../shared/utils";

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