import { FastifyReply, FastifyRequest } from "fastify";
import { validateEmailEmitter as emitter } from "../validations";
import { jwtUtil } from "../../shared/utils";
import {
  createUser,
  deleteUserById,
  findUserById,
  updateUser,
  CreateUserInput,
  UpdateUserInput
} from ".";

export const createUserHandler = async (
  req: FastifyRequest<{ Body: CreateUserInput }>,
  res: FastifyReply,
) => {
  const { generateSignUpToken } = jwtUtil(req);

  const body = req.body;

  try {
    const user = await createUser(body);

    const token = generateSignUpToken(user);

    emitter.emit("verifyEmail", user);

    return res.code(201).send({
      success: true,
      code: 201,
      message: "Usuário criado com sucesso.",
      data: token
    });

  } catch (error) {

    return res.code(500).send({
      success: false,
      code: 500,
      message: "Nao foi possível criar o usuário.",
      error: error
    });

  }
}

export const getUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const id = req.user.userId;

  const user = await findUserById(id);

  if (!user) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Usuário não encontrado.",
      error: null
    });
  }

  const { password, salt, ...rest } = user;

  return res.code(200).send({
    success: true,
    code: 200,
    message: "Usuário encontrado.",
    data: { ...rest }
  });
};

export const deleteUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const id = req.user.userId;

  const user = await deleteUserById(id);

  if (!user) {
    return res.code(500).send({
      success: false,
      code: 500,
      message: "Não foi possível excluir a conta.",
      error: null
    });
  }

  return res.code(200).send({
    success: true,
    code: 200,
    message: "Conta removida com sucesso.",
    data: null
  });
}

export const udpateUserHandler = async (
  req: FastifyRequest<{ Body: UpdateUserInput }>,
  res: FastifyReply,
) => {
  const body = req.body;
  const id = req.user.userId;

  const user = await findUserById(id);

  if (!user) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Usuário não encontrado.",
      data: null
    });
  }

  try {
    const userUpdated = await updateUser(body, user);

    const { password, salt, ...rest } = userUpdated;

    return res.code(200).send({
      success: true,
      code: 200,
      message: "Usuário atualizado com sucesso.",
      data: { ...rest }
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      code: 500,
      message: "Não foi possível atualizar o usuário.",
      error: error
    });
  }
}
