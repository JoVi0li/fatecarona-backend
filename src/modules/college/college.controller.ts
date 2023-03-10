import { FastifyReply, FastifyRequest } from "fastify";
import { getCourse } from "../course/course.service";
import {
  CreateCollegeInput,
  UpdateCollegeNameInput,
  createCollege,
  getCollege,
  getAllColleges,
  deleteCollege,
  updateCollegeName
} from ".";

export const createCollegeHandler = async (
  req: FastifyRequest<{ Body: CreateCollegeInput }>,
  res: FastifyReply,
) => {
  const body = req.body;
  const role = req.user.role;

  if (role !== "ADMIN") {
    return res.code(403).send({
      success: false,
      code: 403,
      message: "Você não possui permissão para realizar essa ação.",
      data: null
    });
  }

  try {
    await createCollege(body);

    return res.code(201).send({
      success: true,
      code: 201,
      message: "Faculdade criado com sucesso.",
      data: null,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Não foi possível criar a faculdade.",
      error: error,
    });
  }
};

export const getCollegeHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const id = req.user.courseId;

  const course = await getCourse(id);

  if (!course) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Não foi possível encontrar sua faculdade.",
      data: null
    });
  }

  const college = await getCollege(course!.collegeId);

  if (!college) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Não foi possível encontrar sua faculdade.",
      data: null
    });
  }

  return res.code(200).send({
    success: true,
    code: 200,
    message: "Faculdade encontrada.",
    data: college
  });
};

export const getAllCollegesHandler = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const colleges = await getAllColleges();

  if(colleges.length < 1) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Nenhuma faculdade foi encontrada.",
      error: null
    });
  }

  return res.code(200).send({
    success: true,
    code: 200,
    message: "Faculdades encontradas.",
    data: colleges
  });
}

export const deleteCollegeHandler = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply,
) => {
  const id = req.params.id;
  const role = req.user.role;

  if (role !== "ADMIN") {
    return res.code(403).send({
      success: false,
      code: 403,
      message: "Você não possui permissão para realizar essa ação.",
      data: null
    });
  }

  const college = await deleteCollege(id);

  if (!college) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Faculdade não encontrada.",
      data: null
    });
  }

  return res.code(200).send({
    success: false,
    code: 200,
    message: "Faculdade removida com sucesso.",
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

  if (role !== "ADMIN") {
    return res.code(403).send({
      success: false,
      code: 403,
      message: "Você não possui permissão para realizar essa ação.",
      data: null
    });
  }

  try {
    const collegeUpdated = await updateCollegeName(id, body);
    
    return res.code(200).send({
      success: true,
      code: 200,
      message: "Faculdade atualizada com sucesso.",
      data: collegeUpdated
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      code: 500,
      message: "Nao foi possível atualizar a faculdade.",
      error: error
    });
  }
};