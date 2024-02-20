import { type Adapter, type AdapterUser, type VerificationToken } from "@auth/core/adapters";

import { config } from "@/config";
import { airtable } from "@/lib/airtable/client";

type SentVerificationToken = Omit<VerificationToken, "expires">;

const noopAdapater: Adapter = {
  createUser(user) {
    console.log("createUser", user);
    return { ...user, id: user.email };
  },

  getUser(_) {
    console.log("getUser", _);
    return null;
  },

  getUserByAccount(_) {
    console.log("getUserByAccount", _);
    return null;
  },

  updateUser(user) {
    console.log("updateUser", user);
    return user as AdapterUser;
  },

  linkAccount(_) {
    console.log("linkAccount", _);
    return _;
  },

  createSession(session) {
    console.log("createSession", session);
    return session;
  },

  getSessionAndUser(_) {
    return null;
  },

  updateSession(_) {
    return null;
  },
  deleteSession(_) {
    return null;
  },

  getAccount(_) {
    console.log("getAccount", _);
    return null;
  },
};

type VerificationTokenModel = {
  created_at: number;
  expires: number;
  identifier: string;
  token: string;
};

type AuthenticatorModel = {
  counter: number;
  credentialBackedUp: boolean;
  credentialDeviceType: string;
  credentialID: string;
  credentialPublicKey: string;
  providerAccountId: string;
  transports?: string;
  userId: string;
};

type MembreModel = {
  Actif: boolean;
  Email: string;
  Nom: string;
  Startups: string[];
};

type AutreContactModel = {
  Email: string;
  Nom: string;
  Rôle: string;
  Startups: string[];
};

const OLD_DATE = new Date("1970-01-01");

declare module "@auth/core/adapters" {
  export interface AdapterUser {
    startups: string[];
    type: "Gestionnaire" | "Membre";
  }
}

export const AirtableAdapter = (): Adapter => {
  const appBase = airtable.base(config.api.airtable.appBaseId);
  const base = airtable.base(config.api.airtable.baseId);

  const verificationTokenTable = appBase.table<VerificationTokenModel>("VerificationToken");
  const authenticatorTable = appBase.table<AuthenticatorModel>("Authenticator");

  const membreTable = base.table<MembreModel>("Membre");
  const autreContactTable = base.table<AutreContactModel>("Autre Contact");

  return {
    ...noopAdapater,
    async getUserByEmail(email) {
      const foundMembre = (await membreTable.select({ filterByFormula: `{Email} = "${email}"` }).firstPage())[0];

      if (foundMembre && foundMembre.fields.Actif) {
        return {
          email: foundMembre.fields.Email,
          name: foundMembre.fields.Nom,
          emailVerified: OLD_DATE,
          id: foundMembre.id,
          startups: foundMembre.fields.Startups,
          type: "Membre",
        };
      }

      const foundAutreContact = (
        await autreContactTable.select({ filterByFormula: `{Email} = "${email}"` }).firstPage()
      )[0];

      if (foundAutreContact) {
        return {
          email: foundAutreContact.fields.Email,
          name: foundAutreContact.fields.Nom,
          emailVerified: OLD_DATE,
          id: foundAutreContact.id,
          startups: foundAutreContact.fields.Startups,
          type: foundAutreContact.fields.Rôle as AdapterUser["type"],
        };
      }

      return null;
    },

    async createVerificationToken(verificationToken: VerificationToken): Promise<VerificationToken | null | undefined> {
      await verificationTokenTable.create([
        {
          fields: {
            token: verificationToken.token,
            expires: verificationToken.expires.getTime(),
            identifier: verificationToken.identifier,
          },
        },
      ]);
      return verificationToken;
    },

    /**
     * Return verification token from the database
     * and delete it so it cannot be used again.
     */
    async useVerificationToken({ identifier, token }: SentVerificationToken): Promise<VerificationToken | null> {
      const foundToken = await verificationTokenTable
        .select({
          filterByFormula: `{identifier} = "${identifier}"`,
        })
        .firstPage();

      if (foundToken.length && foundToken[0].fields.token === token) {
        await verificationTokenTable.destroy([foundToken[0].id]);
        return {
          identifier,
          token,
          expires: new Date(foundToken[0].fields.expires),
        };
      }

      return null;
    },

    async createAuthenticator(authenticator) {
      await authenticatorTable.create([
        {
          fields: authenticator,
        },
      ]);
      return authenticator;
    },

    async listAuthenticatorsByUserId(userId) {
      const authenticators = await authenticatorTable
        .select({
          filterByFormula: `{userId} = "${userId}"`,
        })
        .all();

      return authenticators.map(authenticator => authenticator.fields);
    },

    async getAuthenticator(credentialID) {
      return (
        (await authenticatorTable.select({ filterByFormula: `{credentialID} = "${credentialID}"` }).firstPage())[0]
          ?.fields ?? null
      );
    },

    async updateAuthenticatorCounter(credentialID, newCounter) {
      const foundAuthenticator = (
        await authenticatorTable.select({ filterByFormula: `{credentialID} = "${credentialID}"` }).firstPage()
      )[0];

      if (!foundAuthenticator) {
        throw new Error("Authenticator not found");
      }

      return (
        await authenticatorTable.update([
          {
            id: foundAuthenticator.id,
            fields: {
              counter: newCounter,
            },
          },
        ])
      ).map(record => record.fields)[0];
    },
  };
};
