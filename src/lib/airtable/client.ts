import Airtable from "@lsagetlethias/node-airtable";

import { config } from "@/config";

import { type CustomAirtable } from "./types";

export const airtable = new Airtable({
  apiKey: config.api.airtable.apiKey,
  fetch,
}) as CustomAirtable;

export const appBase = airtable.base<"app">(config.api.airtable.appBaseId);
export const budgetBase = airtable.base<"budget">(config.api.airtable.baseId);

export const verificationTokenTable = appBase.table("VerificationToken");
export const authenticatorTable = appBase.table("Authenticator");

export const membreTable = budgetBase.table("Membre");
export const autreContactTable = budgetBase.table("Autre Contact");
export const startupTable = budgetBase.table("Startup");
export const craTable = budgetBase.table("CRA");
export const missionTable = budgetBase.table("Mission");
