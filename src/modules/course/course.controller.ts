import { FastifyReply, FastifyRequest } from "fastify"
import { CreateCourseInput } from "./course.schema"
import { createCourse, getCourse } from "./course.service";

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
  const id = req.user.studentId;

  

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

}

export const deleteCourseHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {

}

export const updateCourseHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {

}
