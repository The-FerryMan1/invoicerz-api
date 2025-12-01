import nodemailer from "nodemailer";

interface VerificationEmail {
  to: string;
  subject: string;
  text: string;
}

export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASSWORD!,
  },
});

export async function sendEmail({ subject, text, to }: VerificationEmail) {
  const info = await transporter.sendMail({
    from: "Invoicerz",
    subject,
    text,
    to,
  });
}
