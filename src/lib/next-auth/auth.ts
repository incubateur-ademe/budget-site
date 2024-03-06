import NextAuth from "next-auth";
import { type AdapterUser } from "next-auth/adapters";
import Nodemailer from "next-auth/providers/nodemailer";

import { config } from "@/config";

import { AirtableAdapter } from "./db/AirtableAdapter";

declare module "next-auth" {
  interface Account {
    user: AdapterUser;
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
  theme: {
    logo: "/img/ademe-incubateur-logo.png",
    brandColor: "#0053B3",
    colorScheme: "auto",
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login/error",
    verifyRequest: "/login/verify-request",
  },
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
    // WebAuthn,
    // Passkey({
    //   registrationOptions: {},
    // }),
  ],
  callbacks: {
    signIn({ user, account }) {
      if (account?.provider !== "nodemailer" && account?.provider !== "webauthn") {
        return false;
      }

      if (!(user as AdapterUser).emailVerified || !user.name) {
        return false;
      }

      account.user = user as AdapterUser;
      return true;
    },
    jwt({ token, account, trigger }) {
      if (trigger === "signIn" && account) {
        token = { ...token, user: account.user };
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});
