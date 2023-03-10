import { prismaService as prisma } from "../../shared/services";
import { CreateEventInput, UpdateEventStatusInput } from "./event.schema";

export const createEvent = async (body: CreateEventInput) => {
  return await prisma.event.create({
    data: body
  });
}

export const deleteEvent = async (id: string) => {
  return await prisma.event.delete({
    where: {
      id: id
    }
  });
}

export const getAvailableEvents = async () => {
  return await prisma.event.findMany({
    where: {
      status: "WAITING_PARTICIPANTS"
    }
  });
}

export const getOwnedEvent = async (id: string) => {
  return await prisma.event.findMany({
    where: {
      ownerId: id,
    }
  });
}

export const getParticipantEvent = async (id: string) => {
  return await prisma.userCollege.findMany({
    where: {
      id: id
    },
    select: {
      participantEvents: true
    },
  });
}

export const getEventDetails = async (id: string) => {
  return await prisma.event.findUnique({
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