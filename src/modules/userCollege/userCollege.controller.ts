import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { SignUpToken } from "../../shared/utils";
import { CreateUserCollegeInput, UpdateUserCollegeRole } from "./userCollege.schema";
import { createUserCollege, deleteUserCollegeById, findUserCollegeById, updateUserCollegeRole } from "./userCollege.service";

export const createUserCollegeHandler = async (
  req: FastifyRequest<{ Body: CreateUserCollegeInput }>,
  res: FastifyReply,
) => {

  const body = req.body;
  const token = req.user as SignUpToken;
  const datetime = z.string().datetime();

  try {
    const data = {
      courseId: body.courseId,
      studentNumber: body.studentNumber,
      conclusion: datetime.parse(body.conclusion),
      userId: token.userId,
    }

    const userCollege = await createUserCollege(data);

    return res.code(201).send({
      success: true,
      code: 201,
      message: "Estudante criado com sucesso",
      data: userCollege.id,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      code: 500,
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

  if (!student) {
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

  if (!student) {
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
  });
};

export const updateUserCollegeRoleHandler = async (
  req: FastifyRequest<{ Body: UpdateUserCollegeRole }>,
  res: FastifyReply,
) => {
  const newRole = req.body;
  const id = req.user.studentId;

  const student = await findUserCollegeById(id);

  if (!student) {
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