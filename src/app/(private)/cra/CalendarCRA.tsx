"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { endOfMonth, format } from "date-fns";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";

import { config } from "@/config";
import { type CraDto } from "@/lib/dto";
import { capitalizedMonth } from "@/utils/date";

import { StatusBadge } from "./StatusBadge";

interface CalendarCRAProps {
  craList: CraDto[];
}

export const CalendarCRA = ({ craList }: CalendarCRAProps) => {
  const router = useRouter();
  const today = new Date();

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
        const month = format(date, "yyyy-MM");
        router.push(`/cra/${month}`);
      }}
    />
  );
};
