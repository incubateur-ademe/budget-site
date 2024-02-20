import NextAuth from "next-auth";
import { type AdapterUser } from "next-auth/adapters";
import Nodemailer from "next-auth/providers/nodemailer";

import { config } from "@/config";

import { AirtableAdapter } from "./db/AirtableAdapter";

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth({
  secret: config.api.security.auth.secret,
  session: {
    strategy: "jwt",
  },
  adapter: AirtableAdapter(),
  // experimental: {
  //   enableWebAuthn: true,
  // },
  providers: [
    Nodemailer({
      server: {
        host: config.api.mailer.host,
        port: config.api.mailer.smtp.port,
        auth: {
          user: config.api.mailer.smtp.login,
          pass: config.api.mailer.smtp.password,
        },
      },
      from: config.api.mailer.from,
    }),
    // Passkey({
    //   registrationOptions: {},
    // }),
  ],
  callbacks: {
    signIn({ user, account }) {
      console.log("account?.provider", account?.provider);
      if (account?.provider !== "nodemailer") {
        return false;
      }

      if (!(user as AdapterUser).emailVerified || !user.name) {
        return false;
      }
      return true;
    },
  },
});
