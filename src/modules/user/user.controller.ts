import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, SigninUserInput } from "./user.schema";
import { createUser, findUserByEmail } from "./user.service";
import bcrypt from "bcrypt";
import { server } from "../../app";

export const createUserHandler = async (
  req: FastifyRequest<{ Body: CreateUserInput }>,
  res: FastifyReply,
) => {
  const body = req.body;

  try {
    const user = await createUser(body);
    return res.code(201).send({
      success: true,
      message: "Usuário criado com sucesso",
      userId: user.id,
    })
  } catch (error) {
    return res.send({
      success: false,
      error
    })
  }
}

export const signinHandler = async (
  req: FastifyRequest<{ Body: SigninUserInput }>,
  res: FastifyReply,
) => {
  const body = req.body;

  const user = await findUserByEmail(body.email)

  if (!user) {
    return res.status(401).send({
      success: false,
      message: "Credenciais inválidas"
    });
  }

  const correctPassword = await bcrypt.compare(body.password, user.password);

  if (!correctPassword) {
    return res.status(401).send({
      success: false,
      message: "Credenciais inválidas"
    });
  }

  const { password, salt, ...rest } = user;

  const token = server.jwt.sign({rest}, {
    expiresIn: 604800,
    aud: "Fatecarona",
    
  });

  return res.code(200).send({
    success: true,
    message: "Autenticado com sucesso",
    token: token
  })

};
