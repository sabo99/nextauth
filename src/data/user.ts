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

export const updateUser = async (id: string, values: any) => {
  try {
    await db.user.update({ where: { id: id }, data: { ...values } });

    return { success: "Settings Updated!" };
  } catch (error) {
    console.error("Update User", error);
    return null;
  }
};
