"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { endOfMonth, format, isSameMonth, isWithinInterval } from "date-fns";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";

import { config } from "@/config";
import { type CraDto, type MissionDto } from "@/lib/dto";
import { capitalizedMonth } from "@/utils/date";

import { useDrawerStore } from "../../@drawer/DrawerStoreProvider";
import { StatusBadge } from "./StatusBadge";

interface CalendarCRAProps {
  craList: CraDto[];
  missionList: MissionDto[];
}

export const CalendarCRA = ({ craList, missionList }: CalendarCRAProps) => {
  const router = useRouter();
  const openDrawer = useDrawerStore(store => store.open);
  const today = new Date();

  // check if the month is in a mission
  // a month date is the first day of the month
  // to be considered in a mission, the month date must be between the start and end date of the mission
  // only the year and month of the month date are considered
  const isMonthInMission = (date: Date) => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    if (missionList.length === 0) {
      return false;
    }

    for (const mission of missionList) {
      const missionStartYear = mission.startDate.getFullYear();
      const missionStartMonth = mission.startDate.getMonth();

      if (isWithinInterval(date, { start: mission.startDate, end: mission.endDate })) {
        return true;
      }

      if (currentYear === missionStartYear && currentMonth === missionStartMonth) {
        return true;
      }
    }

    return false;
  };

  return (
    <Calendar
      minDate={config.firstDate}
      maxDate={endOfMonth(today)}
      minDetail="year"
      maxDetail="year"
      goToRangeStartOnSelect={false}
      selectRange={false}
      allowPartialRange={false}
      locale="fr-FR" // prevent hydration error
      tileDisabled={({ date }) => !isMonthInMission(date) && !isSameMonth(date, today)}
      tileContent={({ date }) => {
        const monthName = capitalizedMonth(date);
        const yearMonth = format(date, "yyyy-MM");
        const cras = craList.filter(cra => cra.yearMonth === yearMonth);
        const commentIcon = (
          <span
            className={fr.cx("fr-icon-message-2-fill", "fr-icon--md")}
            style={{ color: fr.colors.decisions.text.default.grey.default }}
            aria-hidden
          ></span>
        );

        if (date > today) {
          return <>{monthName}</>;
        }

        if (!isMonthInMission(date) && isSameMonth(date, today)) {
          return (
            <>
              {monthName} <StatusBadge status="Mission manquante" />
            </>
          );
        }

        const hasComment = cras.some(cra => cra.intraComment);
        if (!cras.length || cras.some(cra => cra.status === "À compléter")) {
          return (
            <>
              {monthName} {hasComment && commentIcon} <StatusBadge status="À compléter" />
            </>
          );
        }

        return (
          <span style={{ color: fr.colors.decisions.text.default.success.default }}>
            {monthName} <span className={fr.cx("fr-icon-success-fill", "fr-icon--md")} aria-hidden></span>
            {hasComment && commentIcon}
          </span>
        );
      }}
      onClickMonth={date => {
        if (!isMonthInMission(date)) {
          openDrawer();
          return router.push("/mission/new");
        }
        const month = format(date, "yyyy-MM");
        router.push(`/cra/declaration/${month}`);
      }}
    />
  );
};
