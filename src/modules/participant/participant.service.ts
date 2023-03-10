import { prismaService as prisma } from "../../shared/services";
import { CreateParticipantInput } from "./participant.schema";

export const createParticipant = async (input: CreateParticipantInput) => {
  return await prisma.participant.create({
    data: input
  })
}

export const disableParticipant = async (id: string) => {
  return await prisma.participant.update({
    where: {
      id: id
    },
    data: {
      active: false
    }
  });
}