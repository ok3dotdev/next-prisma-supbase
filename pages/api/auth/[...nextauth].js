import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import nodemailer from "nodemailer";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import path from "path";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailsDir = path.resolve(process.cwd(), "emails");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
});

const sendVerificationRequest = async ({ identifier, url }) => {
  const emailFile = readFileSync(path.join(emailsDir, "confirm-email.html"), {
    encoding: "utf8",
  });
  const emailTemplate = Handlebars.compile(emailFile);
  await resend.emails.send({
    from: "Roomiez App",
    to: identifier,
    subject: "our sign-in link for Roomiez",
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  });
  // transporter.sendMail({
  //   from: `"✨ Roomiez" ${process.env.EMAIL_FROM}`,
  //   to: identifier,
  //   subject: "Your sign-in link for SupaVacation",
  //   html: emailTemplate({
  //     base_url: process.env.NEXTAUTH_URL,
  //     signin_url: url,
  //     email: identifier,
  //   }),
  // });
};

const sendWelcomeEmail = async ({ user }) => {
  const { email } = user;

  try {
    const emailFile = readFileSync(path.join(emailsDir, "welcome.html"), {
      encoding: "utf8",
    });
    const emailTemplate = Handlebars.compile(emailFile);

    const data = await resend.emails.send({
      from: "Roomiez App",
      to: email,
      subject: "Welcome to Roomiez! 🎉",
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: "support@roomiez.dev",
      }),
    });
    console.log("dataaaaa", data);
    // res.status(200).json(data);
    // await transporter.sendMail({
    //   from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
    //   to: email,
    //   subject: 'Welcome to SupaVacation! 🎉',
    //   html: emailTemplate({
    //     base_url: process.env.NEXTAUTH_URL,
    //     support_email: 'support@themodern.dev',
    //   }),
    // });
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`);
  }
};

export default NextAuth({
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  events: { createUser: sendWelcomeEmail },
  adapter: PrismaAdapter(prisma),
});
