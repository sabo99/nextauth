"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUser } from "@/data/user";
import { sendVerificationEmail } from "@/lib/nodemailer/nodemailer";
// import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Login failed. Please try again later." };
  }

  const { email, password, name } = validatedFields.data;
  const hashPassword = await bcrypt.hash(password, 12);

  const existingUser = await getUser(email, "email");

  if (existingUser) {
    return {
      error: "Email already exists!",
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  // TODO: Send verification token email
  await sendVerificationEmail(email);

  return { success: "Confirmation email sent!" };
};
