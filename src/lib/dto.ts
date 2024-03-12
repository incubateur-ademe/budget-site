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

export interface MissionDto {
  consumedDays: number;
  cra: string[];
  endDate: Date;
  id: string;
  member: string;
  plannedDays: number;
  startDate: Date;
  startup: string;
  timeSpan: number;
  tjm: number;
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
