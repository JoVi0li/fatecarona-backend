import { FastifyRequest, FastifyReply } from "fastify";
import { findUserByEmail, findUserById } from "../user/user.service";
import { SigninUserInput } from "./auth.schema";
import bcrypt from "bcrypt";
import { verifyEmail } from "./auth.service";
import { jwtUtil } from "../../shared/utils";

export const signinHandler = async (
  req: FastifyRequest<{ Body: SigninUserInput }>,
  res: FastifyReply,
) => {
  const { generateSignInToken } = jwtUtil(req);
  const body = req.body;

  const user = await findUserByEmail(body.email)

  if (!user) {
    return res.status(401).send({
      success: false,
      code: 401,
      message: "Credenciais inválidas",
      error: null
    });
  }

  const correctPassword = await bcrypt.compare(body.password, user.password);

  if (!correctPassword) {
    return res.status(401).send({
      success: false,
      code: 401,
      message: "Credenciais inválidas",
      error: null
    });
  }

  if (!user.verifiedEmail) {
    return res.status(401).send({
      success: false,
      code: 401,
      message: "E-mail não verificado",
      error: null
    });
  }

  const token = generateSignInToken(user);

  return res.code(200).send({
    success: true,
    message: "Autenticado com sucesso",
    data: token
  });

};

export const verifyEmailHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { userId: id, status } = req.user;

  const user = await findUserById(id);

  if (!user) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Usuário não encontrado.",
      error: null,
    });
  }

  if (status != "SIGNIN") {
    return res.code(400).send({
      success: false,
      code: 400,
      message: "Usuário inválido.",
      error: null,
    });
  }

  const updatedUser = await verifyEmail(user.id);

  if (!updatedUser.verifiedEmail) {
    return res.code(500).send({
      success: false,
      code: 500,
      message: "Não foi possível verificar o e-mail do usuário.",
      error: null,
    });
  }

  return res.code(200).send({
    success: true,
    code: 200,
    message: "E-mail verificado com sucesso.",
    error: null
  });
}