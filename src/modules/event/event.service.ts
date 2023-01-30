import { prisma } from "../../utils/prisma";
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

export const getActiveEvents = async () => {
  return await prisma.event.findMany({
    where: {
      status: "WAITING_PARTICIPANTS"
    }
  });
}

export const getEventsWhereIAmOwner = async (userCollegeId: string) => {
  return await prisma.event.findMany({
    where: {
      ownerId: userCollegeId,
      
    }
  })
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