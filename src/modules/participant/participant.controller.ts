import { FastifyReply, FastifyRequest } from "fastify";
import { CreateParticipantInput, DisableParticipantInput } from "./participant.schema";
import { createParticipant, disableParticipant } from "./participant.service";

export const createParticipantHandler = async (
  req: FastifyRequest<{ Body: CreateParticipantInput }>,
  res: FastifyReply
) => {
  const body = req.body;

  try {
    const participant = await createParticipant(body);

    return res.code(201).send({
      success: true,
      message: "Participante criado com sucesso",
      data: participant
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      message: "Não foi possível criar o participante",
      data: null
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
      message: "Participante desabilitado com sucesso",
      data: null
    });
  } catch (error) {
    return res.code(500).send({
      success: false,
      message: "Não foi possível desabilitar o participante",
      data: null
    })
  }
}