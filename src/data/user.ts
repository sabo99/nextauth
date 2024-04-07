import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await db.user.findUnique({ where: { email: email } });
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    return await db.user.findUnique({ where: { id: id } });
  } catch (error) {
    return null;
  }
};
