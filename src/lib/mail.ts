import { Resend } from "resend";
import { generateVerificationToken } from "@/lib/tokens";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (values: string | string[]) => {
  const emails = typeof values === "string" ? [values] : values;

  for (const email of emails) {
    const verificationToken = await generateVerificationToken(email);
    const confirmLink = `http://localhost:3000/auth/verify?token=${verificationToken.token}`;
    const subject = "Verification Email";

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: subject,
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  }
};
