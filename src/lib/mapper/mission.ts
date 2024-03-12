import "@/utils/date";

import { UTCDate } from "@date-fns/utc";
import { type Record } from "@lsagetlethias/node-airtable";
import { endOfDay, startOfDay } from "date-fns";

import { type MissionModel } from "../airtable/models";
import { type MissionDto } from "../dto";

export const missionMapper = (cra: Record<MissionModel>): MissionDto => ({
  id: cra.getId(),
  member: cra.fields._MembreID[0],
  startup: cra.fields.Startup[0],
  tjm: cra.fields.TJM,
  consumedDays: cra.fields["Jours consommés"],
  plannedDays: cra.fields["Jours prévus"],
  startDate: startOfDay(new UTCDate(cra.fields["Date début"])),
  endDate: endOfDay(new UTCDate(cra.fields["Date fin"])),
  timeSpan: cra.fields["Temps passé"],
  cra: cra.fields.CRA,
});
