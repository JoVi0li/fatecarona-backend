import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserCollegeInput, UpdateUserCollegeRole } from "./userCollege.schema";
import { createUserCollege, deleteUserCollegeById, findUserCollegeById, updateUserCollegeRole } from "./userCollege.service";

export const createUserCollegeHandler = async (
  req: FastifyRequest<{ Body: CreateUserCollegeInput }>,
  res: FastifyReply,
) => {

  const body = req.body;

  try {
    const userCollege = await createUserCollege(body);
    return res.code(201).send({
      success: true,
      message: "Estudante criado com sucesso",
      data: userCollege.id,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Não foi possível criar o estudante",
      error: error,
    });
  }
};

export const getUserCollegeHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.studentId;

  const student = await findUserCollegeById(id);

  if(!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  return res.code(200).send({
    success: true,
    message: "Estudante encontrado",
    data: student
  });
};

export const deleteUserCollegeHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.studentId;

  const student = await deleteUserCollegeById(id);

  if(!student) {
    return res.code(500).send({
      success: false,
      message: "Não foi possível excluir o estudante",
      data: null,
    });
  }

  return res.code(200).send({
    success: false,
    message: "Estudante removido com sucesso",
    data: null
  })
};

export const updateUserCollegeRoleHandler = async (
  req: FastifyRequest<{ Body: UpdateUserCollegeRole }>,
  res: FastifyReply,
) => {
  const newRole = req.body;
  const id = req.user.studentId;

  const student = await findUserCollegeById(id);

  if(!student) {
    return res.code(404).send({
      success: false,
      message: "Estudante não encontrado",
      data: null
    });
  }

  try {
    const studentUpdated = await updateUserCollegeRole(id, newRole);

    return res.code(200).send({
      success: true,
      message: "Estudante atualizado com sucesso",
      data: studentUpdated,
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      message: "Nao foi possível atualizar o estudante",
      error: error,
    });
  }
};