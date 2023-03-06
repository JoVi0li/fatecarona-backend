import { FastifyRequest, FastifyReply } from "fastify";
import { findUserByEmail, findUserById } from "../user/user.service";
import { SigninUserInput } from "./auth.schema";
import bcrypt from "bcrypt";
import { verifyEmail } from "./auth.service";
import { jwtUtil } from "../../shared/utils";
import { getInvalidUserDocumentByUserCollegeId, getUserDocumentByUserCollegeId } from "../userDocuments/userDocuments.service";

export const signinHandler = async (
  req: FastifyRequest<{ Body: SigninUserInput }>,
  res: FastifyReply,
) => {
  const { generateSignInToken } = jwtUtil(req);
  const body = req.body;

  const user = await findUserByEmail(body.email);

  if (!user?.userCollege) {
    return res.status(400).send({
      success: false,
      code: 400,
      message: "Cadastro incompleto",
      error: null
    });
  }

  if (!user.userCollege.verifiedStudentNumber) {
    return res.status(400).send({
      success: false,
      code: 400,
      message: "RA inválido",
      error: null
    });
  }

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

  const documents = await getUserDocumentByUserCollegeId(user.userCollege.id);

  const invalidDocuments = documents.filter(doc => !doc.isValid);

  if (invalidDocuments.length > 0) {
    return res.status(400).send({
      success: false,
      code: 400,
      message: "Possui documento(s) inválido(s)",
      error: null
    });
  }

  if (documents.length < 4) {
    return res.status(400).send({
      success: false,
      code: 400,
      message: "Documentos insuficientes",
      error: null
    });
  }

  const token = await generateSignInToken(user);

  return res.code(200).send({
    success: true,
    message: "Autenticado com sucesso",
    data: token
  });

};

export const verifyEmailHandler = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Token inválido",
      error: null,
    });
  }

  const user = await findUserById(id);

  if (!user) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Usuário não encontrado.",
      error: null,
    });
  }

  if (user.verifiedEmail) {
    return res.code(400).send({
      success: false,
      code: 400,
      message: "Usuário já verificado",
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