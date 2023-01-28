import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCollegeInput, UpdateCollegeNameInput } from "./college.schema";
import { createCollege, deleteCollege, getAllColleges, getCollege, updateCollegeName } from "./college.service";

export const createCollegeHandler = async (
  req: FastifyRequest<{ Body: CreateCollegeInput }>,
  res: FastifyReply,
) => {
  const body = req.body;

  try {
    const college = await createCollege(body);
    
    return res.code(201).send({
      success: true,
      message: "Faculdade criado com sucesso",
      data: college.id,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Não foi possível criar a faculdade",
      error: error,
    });
  }
};

export const getCollegeHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.collegeId;

  const college = await getCollege(id);

  if(!college) {
    return res.code(404).send({
      success: false,
      message: "Faculdade não encontrada",
      data: null
    });
  }

  return res.code(200).send({
    success: true,
    message: "Faculdade encontrada",
    data: college
  });
};

export const getAllCollegesHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const colleges = await getAllColleges();

  return res.code(200).send({
    success: true,
    message: "Faculdades encontradas",
    data: colleges,
  });
}

export const deleteCollegeHandler = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply,
) => {
  const id = req.params.id;
  const role = req.user.role;

  if(role !== "ADMIN") {
    return res.code(401).send({
      success: false,
      message: "Você não possui permissão para realizar essa ação",
      data: null,
    });
  }

  const college = await deleteCollege(id);

  if(!college) {
    return res.code(500).send({
      success: false,
      message: "Não foi possível excluir a faculdade",
      data: null,
    });
  }

  return res.code(200).send({
    success: false,
    message: "Faculdade removida com sucesso",
    data: null
  });
};

export const updateCollegeHandler = async (
  req: FastifyRequest<{ Body: UpdateCollegeNameInput, Params: { id: string } }>,
  res: FastifyReply,
) => {
  const body = req.body;
  const id = req.params.id;
  const role = req.user.role;

  if(role !== "ADMIN") {
    return res.code(401).send({
      success: false,
      message: "Você não possui permissão para realizar essa ação",
      data: null,
    });
  }

  try {
    const collegeUpdated = await updateCollegeName(id, body);
    return res.code(200).send({
      success: true,
      message: "Faculdade atualizada com sucesso",
      data: collegeUpdated,
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      message: "Nao foi possível atualizar a faculdade",
      error: error,
    });
  }
};