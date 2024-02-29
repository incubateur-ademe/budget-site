import { differenceInBusinessDays, format, setDefaultOptions } from "date-fns";
import { fr } from "date-fns/locale";
import { capitalize } from "lodash";

import { holidays } from "@/referentiels";

setDefaultOptions({ locale: fr, weekStartsOn: 1 });

export const getWorkingDaysForMonth = (date: Date) => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  // use date-fns to calculate the number of business days in the current month
  const businessDays = differenceInBusinessDays(
    new Date(currentYear, currentMonth + 1, 1),
    new Date(currentYear, currentMonth, 1),
  );
  // exclude holidays and makes sure to only count business days
  const holidaysArray = Object.keys(holidays).filter(holiday => {
    const holidayDate = new Date(holiday);
    return holidayDate.getMonth() === currentMonth && holidayDate.getFullYear() === currentYear;
  });
  const businessDaysWithoutHolidays = businessDays - holidaysArray.length;

  return businessDaysWithoutHolidays;
};

export const capitalizedMonth = (date: Date) => capitalize(format(date, "MMMM"));
