import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateParticipantInput,
  DisableParticipantInput,
  createParticipant,
  disableParticipant
} from ".";

export const createParticipantHandler = async (
  req: FastifyRequest<{ Body: CreateParticipantInput }>,
  res: FastifyReply
) => {
  const body = req.body;

  try {
    await createParticipant(body);

    return res.code(201).send({
      success: true,
      code: 201,
      message: "Participante criado com sucesso.",
      data: null
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      code: 500,
      message: "Não foi possível criar o participante.",
      data: error
    });
  }
}

export const disableParticipantHandler = async (
  req: FastifyRequest<{ Params: DisableParticipantInput }>,
  res: FastifyReply
) => {
  const params = req.params;
  const id = params.participantId;

  try {
    await disableParticipant(id);

    return res.code(200).send({
      success: true,
      code: 200,
      message: "Participante desabilitado com sucesso.",
      data: null
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      code: 500,
      message: "Não foi possível desabilitar o participante.",
      data: error
    });
  }
}