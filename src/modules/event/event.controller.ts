import { FastifyReply, FastifyRequest } from "fastify";
import { findEventsWhereIAmParticipant, findUserCollegeById } from "../userCollege/userCollege.service";
import { CreateEventInput } from "./event.schema";
import { createEvent, getActiveEvents, getEventsWhereIAmOwner } from "./event.service";

export const createEventHandler = async (
  req: FastifyRequest<{ Body: CreateEventInput }>,
  res: FastifyReply
) => {
 const body = req.body;

 try {
  const event = await createEvent(body);
  return res.code(201).send({
    success: true,
    message: "Evento criado com sucesso",
    data: event,
  });
 } catch (error) {
  return res.code(500).send({
    success: false,
    message: "Não foi possível criar o evento",
    data: error
  });
 }
}

export const getActiveEventsHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const activeEvents = await getActiveEvents();

  return res.code(200).send({
    success: true,
    message: "Eventos ativos",
    data: activeEvents
  });}

export const getEventsWhereIAmParticipantHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const studentId = req.user.studentId;

  const student = await findUserCollegeById(studentId);

  if(!student) {
    return res.code(404).send({
      success: false,
      message: "Usuário não encontrado",
      data: null
    })
  }

  const eventsWhereIAmParticipant = await findEventsWhereIAmParticipant(student.id);

  return res.code(200).send({
    success: true,
    message: "Eventos onde é o participante",
    data: eventsWhereIAmParticipant
  });

}

export const getEventsWhereIAmOwnerHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const studentId = req.user.studentId;

  const student = await findUserCollegeById(studentId);

  if(!student) {
    return res.code(404).send({
      success: false,
      message: "Usuário não encontrado",
      data: null
    })
  }

  const eventsWhereIAmOwner = await getEventsWhereIAmOwner(student.id);

  return res.code(200).send({
    success: true,
    message: "Eventos onde é o proprietário",
    data: eventsWhereIAmOwner
  });

}
