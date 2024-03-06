import { type FieldSet } from "airtable";

export interface BaseMapping {
  app: {
    Authenticator: AuthenticatorModel;
    VerificationToken: VerificationTokenModel;
  };
  budget: {
    "Autre Contact": AutreContactModel;
    CRA: CRAModel;
    Membre: MembreModel;
    Startup: StartupModel;
  };
}

// Budget Base

type MembreRole =
  | "chargé·e de déploiement"
  | "chargé·e de portefeuille"
  | "Chargée d'accompagnement collectivités"
  | "coach"
  | "data analyst/engineer"
  | "designer transverse incubateur"
  | "designer"
  | "développeur·euse"
  | "expert·e métier"
  | "Experte transition et planification écologique collectivités"
  | "intrapreneur·e"
  | "product owner / product manager"
  | "rédactrice"
  | "responsable incubateur"
  | "responsable technique incubateur"
  | "Spécialiste carbone";

export interface MembreModel extends FieldSet {
  Actif: boolean;
  "Anciennes Startups"?: string[];
  Email: string;
  "Intra - Startup"?: string[];
  Nom: string;
  Rôle: MembreRole[];
  "Startups Actuelles"?: string[];
  TJM: number;
}

export type AutreContactRole = "Autre" | "Gestionnaire";

export interface AutreContactModel extends FieldSet {
  Email: string;
  Nom: string;
  Rôle: AutreContactRole[];
  Startup: string[];
  Téléphone: string;
}

export interface StartupModel extends FieldSet {
  Nom: string;
}

export interface CRAModel extends FieldSet {
  "Commentaire intra": string;
  "Commentaire membre": string;
  Created: string;
  "Date Mois": string;
  ID: string;
  "Jours travaillés": number;
  "Last Modified": string;
  Membre: [string];
  Startup: [string];
  Status: "À compléter" | "À valider" | "Validé";
  TJM: number;
  _MembreID: [string];
  _YearMonth: string;
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
