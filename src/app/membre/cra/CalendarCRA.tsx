"use client";

import { endOfMonth, format } from "date-fns";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";

import { config } from "@/config";
import { capitalizedMonth } from "@/utils/date";

export const CalendarCRA = () => {
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
      tileContent={({ date }) => capitalizedMonth(date)}
      onClickMonth={date => {
        const month = format(date, "yyyy-MM");
        router.push(`/membre/cra/${month}`);
      }}
    />
  );
};
