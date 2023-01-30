import { z } from "zod";

const createEventSchema = z.object({
  ownerId: z.string({ required_error: "O dono do evento é obrigatório" }),
  aPointId: z.string({ required_error: "O ponto A é obrigatório" }),
  bPoint: z.array(z.string({ required_error: "O ponto B é obrigatório" })).min(2, "Localização inválida").max(2, "Localização inválida"),
});

const updateEventStatusSchema = z.object({
  eventStatus: z.enum(["CREATED", "WAITING_PARTICIPANTS", "IN_PROGRESS", "FINISHED"], { required_error: "Informe o status" }),
})

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventStatusInput = z.infer<typeof updateEventStatusSchema>;