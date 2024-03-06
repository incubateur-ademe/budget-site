import { type MembreModel } from "../airtable/models";

export namespace UserData {
  type Startups = Array<{ id: string; name: string }>;
  export type Base = {
    startups: Startups;
  };

  export type AsMembre = {
    oldStartups: Startups;
    roles: MembreModel["Rôle"];
    tjm: number;
    type: "Membre";
  };

  export type AsIntra = {
    type: "Intra";
  };

  export type AsGestionnaire = {
    phone: string;
    type: "Gestionnaire";
  };
}

export type UserData = UserData.Base & (UserData.AsGestionnaire | UserData.AsIntra | UserData.AsMembre);
