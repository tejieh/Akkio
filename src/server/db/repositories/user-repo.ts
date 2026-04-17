import { getPrisma } from "@/server/db/prisma";

export const userRepo = {
  findById(userId: string) {
    return getPrisma().auth_users.findUnique({
      where: { id: userId },
    });
  },
  findByEmail(email: string) {
    return getPrisma().auth_users.findUnique({
      where: { email },
    });
  },
};
