import { type CRAModel } from "./airtable/models";

export interface CraDto {
  date: Date;
  id: string;
  intraComment: string;
  member: string;
  memberComment: string;
  startup: string;
  status: CRAModel["Status"];
  tjm: number;
  workedDays: number;
  yearMonth: string;
}

export interface MemberDto {
  active: boolean;
  currentStartup: string[];
  email: string;
  name: string;
}

export interface OtherContactDto {
  email: string;
  name: string;
  role: string;
  startup: string[];
}

export interface StartupDto {
  name: string;
}
