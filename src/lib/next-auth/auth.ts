import NextAuth from "next-auth";
import { type AdapterUser } from "next-auth/adapters";
import Nodemailer from "next-auth/providers/nodemailer";

import { config } from "@/config";

import { AirtableAdapter } from "./db/AirtableAdapter";

declare module "next-auth" {
  interface Account {
    data: AdapterUser;
  }

  interface Session {
    user: AdapterUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    user: AdapterUser;
  }
}

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
      if (account?.provider !== "nodemailer") {
        return false;
      }

      if (!(user as AdapterUser).emailVerified || !user.name) {
        return false;
      }

      account.data = user as AdapterUser;
      return true;
    },
    jwt({ token, account, trigger }) {
      if (trigger === "signIn" && account) {
        token = { ...token, user: account.data };
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});
