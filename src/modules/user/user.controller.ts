import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, SigninUserInput, UpdateUserInput } from "./user.schema";
import { createUser, deleteUserById, findUserById, findUserByEmail, updateUser } from "./user.service";
import bcrypt from "bcrypt";

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
      data: user.id,
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

  const token = req.jwt.sign({
    userId: user.id,
    studentId: user.userCollege!.id,
    collegeId: user.userCollege!.collegeId,
    name: user.name,
    email: user.email,
    role: user.userCollege!.role,
  },
    {
      expiresIn: 604800,
      aud: "Fatecarona",

    });

  return res.code(200).send({
    success: true,
    message: "Autenticado com sucesso",
    data: token
  })

};

export const getUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const id = req.user.userId;

  const user = await findUserById(id);

  if (!user) {
    return res.code(404).send({
      success: false,
      message: "Usuário não encontrado"
    });
  }

  const { password, salt, ...rest } = user;

  return res.code(200).send({
    success: true,
    message: "Usuário encontrado",
    data: { ...rest }
  })
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
      message: "Não foi possível excluir a conta"
    });
  }

  return res.code(200).send({
    success: true,
    message: "Conta removida com sucesso",
    data: null
  })
}

export const udpateUserHandler = async (
  req: FastifyRequest<{ Body: UpdateUserInput }>,
  res: FastifyReply,
) => {
  const newUser = req.body;
  const id = req.user.userId;

  const user = await findUserById(id);

  if (!user) {
    return res.code(404).send({
      success: false,
      message: "Usuário não encontrado",
      data: null
    });
  }

  try {
    const userUpdated = await updateUser(newUser, user);

    const { password, salt, ...rest } = userUpdated;

    return res.code(200).send({
      success: true,
      message: "Usuário atualizado com sucesso",
      data: { ...rest }
    })
  } catch (error) {
    return res.code(500).send({
      success: false,
      message: "Não foi possível atualizar o usuário",
      error: error
    })
  }
}
