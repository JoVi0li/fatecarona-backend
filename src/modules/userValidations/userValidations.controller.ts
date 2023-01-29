import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserValidationsSchema } from "./userValidations.schema";
import { createUserValidations } from "./userValidations.service";

export const createUserValidationsHandler = async (
  req: FastifyRequest<{ Body: CreateUserValidationsSchema }>,
  res: FastifyReply
) => {
  const body = req.body;


  try {
    const userValidations = await createUserValidations(body);
    return res.code(201).send({
      success: true,
      message: "Validações do usuário criadas com sucesso",
      data: userValidations.id,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Não foi possível criar as validações do usuário",
      error: error,
    });
  }
}