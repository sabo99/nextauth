"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUser } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/nodemailer/nodemailer";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUser(email, "email");

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  // TODO : Generate token & send email
  await sendPasswordResetEmail(email);

  return { success: "Reset email sent!" };
};
