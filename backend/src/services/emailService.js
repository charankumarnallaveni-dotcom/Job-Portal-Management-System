import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const configured = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

const transporter = configured
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass }
    })
  : null;

export async function sendEmail({ to, subject, html }) {
  if (!configured) {
    console.log(`[email skipped] ${subject} -> ${to}`);
    return { skipped: true };
  }
  return transporter.sendMail({ from: env.smtp.from, to, subject, html });
}

export const sendRegistrationEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: "Welcome to TalentFlow",
    html: `<p>Hi ${user.name}, your TalentFlow account is ready.</p>`
  });

export const sendPasswordResetEmail = (user, token) =>
  sendEmail({
    to: user.email,
    subject: "Reset your TalentFlow password",
    html: `<p>Use this token to reset your password: <strong>${token}</strong></p>`
  });

export const sendInterviewInvitationEmail = (candidate, interview) =>
  sendEmail({
    to: candidate.email,
    subject: "Interview invitation",
    html: `<p>You have an interview scheduled on ${interview.scheduled_at} via ${interview.mode}.</p>`
  });
