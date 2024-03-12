import { type FieldSet } from "@lsagetlethias/node-airtable";

export interface BaseMapping {
  app: {
    Authenticator: AuthenticatorModel;
    VerificationToken: VerificationTokenModel;
  };
  budget: {
    "Autre Contact": AutreContactModel;
    CRA: CRAModel;
    Membre: MembreModel;
    Mission: MissionModel;
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
  readonly Created: string;
  "Date Mois": string;
  readonly ID: string;
  "Jours travaillés": number;
  readonly "Last Modified": string;
  readonly Membre: readonly [string];
  Mission: [string];
  readonly Startup: readonly [string];
  Status: "À compléter" | "À valider" | "Validé";
  readonly TJM: number;
  readonly _MembreID: [string];
  readonly _YearMonth: string;
}

export interface MissionModel extends FieldSet {
  CRA: string[];
  "Date début": string;
  "Date fin": string;
  readonly "Jours consommés": number;
  readonly "Jours prévus": number;
  Membre: [string];
  Startup: [string];
  TJM: number;
  "Temps passé": number;
  readonly _MembreID: readonly [string];
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
