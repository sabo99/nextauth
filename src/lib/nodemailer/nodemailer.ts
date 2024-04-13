import nodemailer from "nodemailer";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import * as fs from "node:fs";
import * as handlebars from "handlebars";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
const domain = process.env.NEXT_PUBLIC_APP_URL;
const EMAIL = process.env.NODEMAILER_AUTH_USER;
const PASSWORD = process.env.NODEMAILER_AUTH_PASS;

const from = `${APP_NAME} <${EMAIL}>`;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

const compileTemplate = (
  templatePath: string,
  data: Record<string, any>,
): string => {
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const compiledTemplate = handlebars.compile(templateContent);
  return compiledTemplate(data);
};

export const sendVerificationEmail = async (values: string | string[]) => {
  const emails = typeof values === "string" ? [values] : values;
  const subject = "📧 Verification Email";

  for (const email of emails) {
    const verificationToken = await generateVerificationToken(email);
    const confirmLink = `${domain}/auth/verify?token=${verificationToken.token}`;

    const htmlString = compileTemplate(
      "./src/lib/nodemailer/templates/verification-email.html",
      {
        urlLink: confirmLink,
        label: "Confirm Your Email",
        expires: verificationToken.expires.toLocaleString(),
      },
    );

    await transporter.sendMail({
      from: from,
      to: [email],
      subject: subject,
      html: htmlString,
    });
  }
};

export const sendPasswordResetEmail = async (values: string | string[]) => {
  const emails = typeof values === "string" ? [values] : values;
  const subject = "🔐 Reset Password";

  for (const email of emails) {
    const passwordResetToken = await generatePasswordResetToken(email);
    const resetLink = `${domain}/auth/new-password?token=${passwordResetToken.token}`;

    const htmlString = compileTemplate(
      "./src/lib/nodemailer/templates/password-reset.html",
      {
        urlLink: resetLink,
        label: "Reset Password",
        expires: passwordResetToken.expires.toLocaleString(),
      },
    );

    await transporter.sendMail({
      from: from,
      to: [email],
      subject: subject,
      html: htmlString,
    });
  }
};

export const sendTwoFactorEmail = async (values: string | string[]) => {
  const emails = typeof values === "string" ? [values] : values;
  const subject = "📱 Two Factor Authentication Code";

  for (const email of emails) {
    const twoFactorToken = await generateTwoFactorToken(email);

    const htmlString = compileTemplate(
      "./src/lib/nodemailer/templates/two-factor-token.html",
      {
        label: twoFactorToken.token,
        expires: twoFactorToken.expires.toLocaleString(),
      },
    );

    await transporter.sendMail({
      from: `noreply <${EMAIL}>`,
      to: [email],
      subject: subject,
      html: htmlString,
    });
  }
};
