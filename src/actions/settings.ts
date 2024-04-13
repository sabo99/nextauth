"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUser, updateUser } from "@/data/user";
import { sendVerificationEmail } from "@/lib/nodemailer/nodemailer";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUser(user.id!, "id");
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUser(values.email, "email");

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already exists!" };
    }

    await sendVerificationEmail(values.email);

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );
    if (!passwordMatch) {
      return { error: "Incorrect password!" };
    }

    values.password = await bcrypt.hash(values.newPassword, 12);
    values.newPassword = undefined;
  }

  await updateUser(dbUser.id, values);

  return { success: "Settings updated!" };
};
