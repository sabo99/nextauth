import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const getUser = async (
  value: string,
  searchBy: "id" | "email",
): Promise<User | null> => {
  try {
    return searchBy === "id"
      ? await db.user.findUnique({ where: { id: value } })
      : await db.user.findUnique({ where: { email: value } });
  } catch (error) {
    return null;
  }
};
