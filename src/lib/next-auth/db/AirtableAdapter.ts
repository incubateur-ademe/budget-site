import { type Adapter, type AdapterUser, type VerificationToken } from "@auth/core/adapters";

import {
  authenticatorTable,
  autreContactTable,
  membreTable,
  startupTable,
  verificationTokenTable,
} from "@/lib/airtable/client";

import { type UserData } from "../UserData";

type SentVerificationToken = Omit<VerificationToken, "expires">;

const noopAdapater: Adapter = {
  createUser(user) {
    return { ...user, id: user.email };
  },

  getUser(_) {
    return null;
  },

  getUserByAccount(_) {
    return null;
  },

  updateUser(user) {
    return user as AdapterUser;
  },

  linkAccount(_) {
    return _;
  },

  createSession(session) {
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
    return null;
  },
};

const OLD_DATE = new Date("1970-01-01");

declare module "@auth/core/adapters" {
  export interface AdapterUser {
    data: UserData;
  }
}

const startupMatcherPromise = (startupId: string) =>
  startupTable.find(startupId).then(startup => ({ id: startup.id, name: startup.fields.Nom }));

export const AirtableAdapter = (): Adapter => {
  return {
    ...noopAdapater,
    async getUserByEmail(email) {
      let data: UserData;
      let user: AdapterUser;
      const foundMembre = (await membreTable.select({ filterByFormula: `{Email} = "${email}"` }).firstPage())[0];

      if (foundMembre && foundMembre.fields.Actif) {
        const startups = await Promise.all((foundMembre.fields["Startups Actuelles"] ?? []).map(startupMatcherPromise));
        const oldStartups = await Promise.all(
          (foundMembre.fields["Anciennes Startups"] ?? []).map(startupMatcherPromise),
        );

        data = foundMembre.fields.Rôle.includes("intrapreneur·e")
          ? { type: "Intra", startups }
          : {
              type: "Membre",
              startups,
              oldStartups,
              roles: foundMembre.fields.Rôle,
              tjm: foundMembre.fields.TJM,
            };
        user = {
          email: foundMembre.fields.Email,
          name: foundMembre.fields.Nom,
          emailVerified: OLD_DATE,
          id: foundMembre.id,
          data,
        };
      } else {
        const foundAutreContact = (
          await autreContactTable.select({ filterByFormula: `{Email} = "${email}"` }).firstPage()
        )[0];

        if (foundAutreContact && foundAutreContact.fields.Rôle.includes("Gestionnaire")) {
          const startups = await Promise.all(foundAutreContact.fields.Startup.map(startupMatcherPromise));

          data = {
            type: "Gestionnaire",
            phone: foundAutreContact.fields.Email,
            startups,
          };

          user = {
            email: foundAutreContact.fields.Email,
            name: foundAutreContact.fields.Nom,
            emailVerified: OLD_DATE,
            id: foundAutreContact.id,
            data,
          };
        } else return null;
      }

      return user;
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
          filterByFormula: `{token} = "${token}"`,
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
          fields: {
            ...authenticator,
          },
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
