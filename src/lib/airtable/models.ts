import { type FieldSet } from "airtable";

export interface BaseMapping {
  app: {
    Authenticator: AuthenticatorModel;
    VerificationToken: VerificationTokenModel;
  };
  budget: {
    "Autre Contact": AutreContactModel;
    Membre: MembreModel;
    Startup: StartupModel;
  };
}

// Budget Base

export interface MembreModel extends FieldSet {
  Actif: boolean;
  Email: string;
  Nom: string;
  "Startup Actuelle": string[];
}

export interface AutreContactModel extends FieldSet {
  Email: string;
  Nom: string;
  Rôle: string;
  Startups: string[];
}

export interface StartupModel extends FieldSet {
  Nom: string;
}

// App Base

export interface VerificationTokenModel extends FieldSet {
  created_at: number;
  expires: number;
  identifier: string;
  token: string;
}

export interface AuthenticatorModel extends FieldSet {
  counter: number;
  credentialBackedUp: boolean;
  credentialDeviceType: string;
  credentialID: string;
  credentialPublicKey: string;
  providerAccountId: string;
  transports?: string;
  userId: string;
}
