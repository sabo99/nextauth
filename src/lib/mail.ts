import { Resend } from "resend";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (values: string | string[]) => {
  const emails = typeof values === "string" ? [values] : values;
  const subject = "Verification Email";

  for (const email of emails) {
    const verificationToken = await generateVerificationToken(email);
    const confirmLink = `${appUrl}/auth/verify?token=${verificationToken.token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: subject,
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  }
};

export const sendPasswordResetEmail = async (values: string | string[]) => {
  const emails = typeof values === "string" ? [values] : values;
  const subject = "Reset Password";

  for (const email of emails) {
    const passwordResetToken = await generatePasswordResetToken(email);
    const resetLink = `${appUrl}/auth/new-password?token=${passwordResetToken.token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: subject,
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
  }
};

export const sendTwoFactorEmail = async (values: string | string[]) => {
  const emails = typeof values === "string" ? [values] : values;
  const subject = "2FA Code";

  for (const email of emails) {
    const twoFactorToken = await generateTwoFactorToken(email);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: subject,
      html: `<p>Your 2FA code : ${twoFactorToken.token}</p>
        <br>
        <p>Your code expired until <b>${twoFactorToken.expires.toLocaleString()}</b></p>`,
    });
  }
};
