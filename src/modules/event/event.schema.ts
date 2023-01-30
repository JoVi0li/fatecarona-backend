import { z } from "zod";

const createEventSchema = z.object({
  ownerId: z.string({ required_error: "O dono do evento é obrigatório" }),
  aPointId: z.string({ required_error: "O ponto A é obrigatório" }),
  bPoint: z.array(z.string({ required_error: "O ponto B é obrigatório" })).min(2, "Localização inválida").max(2, "Localização inválida"),
  fromTo: z.enum(["FROM_A_TO_B", "FROM_B_TO_A"], {required_error: "De onde e para onde está indo é obrigatório"})
});

const updateEventStatusSchema = z.object({
  eventStatus: z.enum(["CREATED", "WAITING_PARTICIPANTS", "IN_PROGRESS", "FINISHED"], { required_error: "Informe o status" }),
})

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventStatusInput = z.infer<typeof updateEventStatusSchema>;