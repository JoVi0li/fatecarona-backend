import { prismaService as prisma } from "../../shared/services";

export const verifyUserEmail = async (id: string) => {
  return await prisma.user.update({
    where: {
      id: id
    },
    data: {
      verifiedEmail: true
    }
  });
}