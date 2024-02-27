"use client";

import { endOfMonth, format } from "date-fns";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";

import { ClientOnly } from "@/components/utils/ClientOnly";
import { config } from "@/config";

export const CalendarCRA = () => {
  const router = useRouter();
  const today = new Date();
  return (
    <ClientOnly>
      <Calendar
        minDate={config.firstDate}
        maxDate={endOfMonth(today)}
        minDetail="year"
        maxDetail="year"
        onClickMonth={date => {
          const month = format(date, "yyyy-MM");
          router.push(`/membre/cra/${month}`);
        }}
      />
    </ClientOnly>
  );
};
