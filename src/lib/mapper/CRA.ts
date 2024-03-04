import { type Record } from "airtable";

import { type CRAModel } from "../airtable/models";
import { type CraDto } from "../dto";

export const craMapper = (cra: Record<CRAModel>): CraDto => ({
  date: new Date(cra.fields["Date Mois"]),
  id: cra.getId(),
  member: cra.fields._MembreID[0],
  startup: cra.fields.Startup[0],
  workedDays: cra.fields["Jours travaillés"],
  yearMonth: cra.fields._YearMonth,
  memberComment: cra.fields["Commentaire membre"],
  intraComment: cra.fields["Commentaire intra"],
  status: cra.fields.Status,
  tjm: cra.fields.TJM,
});
