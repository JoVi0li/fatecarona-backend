import { Participant } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { CreateEventInput, UpdateEventStatusInput } from "./event.schema";

export const createEvent = async (body: CreateEventInput) => {
  return await prisma.event.create({
    data: {
      ownerId: body.ownerId,
      aPointId: body.aPointId,
      bPoint: body.bPoint,
    }
  });
}

export const deleteEvent = async (id: string) => {
  return await prisma.event.delete({
    where: {
      id: id
    }
  });
}

export const updateEventStatus = async (id: string, newStatus: UpdateEventStatusInput) => {
  return await prisma.event.update({
    where: {
      id: id
    },
    data: {
      status: newStatus.eventStatus
    }
  });
}

export const updateEventParticipants = async (id: string, newParticipants: Array<Participant>) => {

}