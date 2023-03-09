import { FastifyReply, FastifyRequest } from "fastify";
import { findUserCollegeById } from "../userCollege/userCollege.service";
import { CreateEventInput } from "./event.schema";
import { createEvent, getAvailableEvents, getOwnedEvent, getParticipantEvent } from "./event.service";

export const createEventHandler = async (
  req: FastifyRequest<{ Body: CreateEventInput }>,
  res: FastifyReply
) => {
  const body = req.body;

  const availableEvents = await getAvailableEvents();

  const alreadyHasAvaliableEvent = availableEvents.some(e => e.aPointId == body.aPointId && e.bPoint == body.bPoint);

  if (alreadyHasAvaliableEvent) {
    return res.code(400).send({
      success: false,
      code: 400,
      message: "Já existe um evento idêntico ao que você quer criar.",
      error: null
    });
  }

  try {
    await createEvent(body);

    return res.code(201).send({
      success: true,
      code: 201,
      message: "Evento criado com sucesso.",
      data: null
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      code: 500,
      message: "Não foi possível criar o evento.",
      data: error
    });
  }
}

export const getAvailableEventsHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const availableEvents = await getAvailableEvents();

  if (availableEvents.length < 1) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Não existem eventos disponíveis no momento.",
      error: null
    });
  }

  return res.code(200).send({
    success: true,
    code: 200,
    message: "Eventos ativos",
    data: availableEvents
  });
}

export const getMyParticipantEvents = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const studentId = req.user.studentId;

  const student = await findUserCollegeById(studentId);

  if (!student) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Usuário não encontrado.",
      data: null
    });
  }

  const myEvents = await getParticipantEvent(student.id);

  return res.code(200).send({
    success: true,
    code: 200,
    message: "Eventos encontrados.",
    data: myEvents
  });
}

export const getOwnedEvents = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) => {
  const id = req.params.id;

  const ownedEvents = await getOwnedEvent(id);

  if (ownedEvents.length < 1) {
    return res.code(404).send({
      success: false,
      code: 404,
      message: "Nenhum evento foi encontrado.",
      data: ownedEvents
    });
  }

  return res.code(200).send({
    success: true,
    code: 200,
    message: "Eventos encontrados.",
    data: ownedEvents
  });
}
