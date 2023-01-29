import { FastifyReply, FastifyRequest } from "fastify"
import { CreateCourseInput, UpdateCourseInput } from "./course.schema"
import { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse } from "./course.service";

export const createCourseHandler = async (
  req: FastifyRequest<{ Body: CreateCourseInput }>,
  res: FastifyReply
) => {
  const body = req.body;
  const role = req.user.role;

  if(role !== "ADMIN") {
    return res.code(401).send({
      success: false,
      message: "Você não possui permissão para realizar essa ação",
      data: null,
    });
  }

  try {
    const course = await createCourse(body);
    
    return res.code(201).send({
      success: true,
      message: "Curso criado com sucesso",
      data: course.id,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Não foi possível criar o curso",
      error: error,
    });
  }
}

export const getCourseHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const id = req.user.courseId;

  const college = await getCourse(id);

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
}

export const getAllCoursesHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const courses = await getAllCourses();

  return res.code(200).send({
    success: true,
    message: "Cursos encontrados",
    data: courses,
  });
}

export const deleteCourseHandler = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
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

  const course = await deleteCourse(id);

  if(!course) {
    return res.code(500).send({
      success: false,
      message: "Não foi possível excluir o curso",
      data: null,
    });
  }

  return res.code(200).send({
    success: false,
    message: "Curso removido com sucesso",
    data: null
  });
}

export const updateCourseHandler = async (
  req: FastifyRequest<{ Body: UpdateCourseInput, Params: { id: string } }>,
  res: FastifyReply
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

  const oldCourse = await getCourse(id);

  if(!oldCourse) {
    return res.code(500).send({
      success: false,
      message: "Curso não encontrado",
      error: null,
    });
  }

  try {
    const collegeUpdated = await updateCourse(id, body, oldCourse);
    return res.code(200).send({
      success: true,
      message: "Courso atualizado com sucesso",
      data: collegeUpdated,
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      message: "Nao foi possível atualizar o curso",
      error: error,
    });
  }
}
