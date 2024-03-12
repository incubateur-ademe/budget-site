import Alert from "@codegouvfr/react-dsfr/Alert";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { z } from "zod";

import { ClientOnly } from "@/components/utils/ClientOnly";
import { config } from "@/config";
import { CenteredContainer } from "@/dsfr";
import { craTable, membreTable, missionTable } from "@/lib/airtable/client";
import { craMapper } from "@/lib/mapper/CRA";
import { auth } from "@/lib/next-auth/auth";
import { capitalizedMonth, getWorkingDaysForMonth } from "@/utils/date";

import { CRAForm } from "./Form";

const yearMonthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "La date doit être au format YYYY-MM (ex: 2024-05)")
  .superRefine((value, ctx) => {
    const [year, month] = value.split("-");
    const currentYear = new Date().getFullYear();
    const firstDateYear = config.firstDate.getFullYear();
    if (parseInt(year) < firstDateYear || parseInt(year) > currentYear) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          currentYear === firstDateYear
            ? `Le CRA demandé doit être de cette année, non pas ${year}.`
            : `Le CRA demandé doit être entre ${firstDateYear} et ${currentYear}, non pas ${year}.`,
      });
    }
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Il n'y a pas de ${month}ème mois dans une année.`,
      });
    }
  })
  .transform(value => {
    const [year, month] = value.split("-");
    return new Date(parseInt(year), parseInt(month) - 1);
  });

interface CRAPageProps {
  params: {
    yearMonth: string;
  };
}

const CRAPage = async ({ params: { yearMonth } }: CRAPageProps) => {
  const parsedMonth = yearMonthSchema.safeParse(yearMonth);

  if (!parsedMonth.success) {
    return (
      <CenteredContainer py="8w">
        <Alert severity="error" title="Mauvaise date" description={parsedMonth.error.errors[0].message} />
      </CenteredContainer>
    );
  }

  const monthDate = parsedMonth.data;

  const session = await auth();
  if (!session?.user || session.user.data.type !== "Membre") {
    return null;
  }

  const userID = session.user.id;
  const user = await membreTable.find(userID);

  if (!user) {
    return null;
  }

  const missionFound = await missionTable
    .select({
      filterByFormula: `AND({_MembreID} = "${userID}", {Date début} <= DATETIME_PARSE("${format(startOfMonth(monthDate), "yyyy-MM-dd")}"), {Date fin} >= DATETIME_PARSE("${format(endOfMonth(monthDate), "yyyy-MM-dd")}"))`,
    })
    .all();

  const craFound = await craTable
    .select(
      {
        filterByFormula: `AND({_MembreID} = "${userID}", {_YearMonth} = "${yearMonth}")`,
      },
      {
        next: {
          tags: [
            "CRA",
            `CRA:Membre:${userID}`,
            `Membre:${userID}`,
            `CRA:YearMonth:${yearMonth}`,
            `CRA:Membre:${userID}:YearMonth:${yearMonth}`,
          ],
        },
      },
    )
    .all();

  console.log({ craFound });

  const defaultTJM = user.fields.TJM ?? 0;
  const businessDaysWithoutHolidays = getWorkingDaysForMonth(monthDate);

  return (
    <CenteredContainer py="4w">
      <h3>
        Votre compte-rendu d'activité pour {capitalizedMonth(monthDate)} {monthDate.getFullYear()}
      </h3>
      <p>Déclarez vos temps pour chaque Startup de l'Incubateur que vous accompagnez.</p>
      <ClientOnly>
        <CRAForm
          maxDays={businessDaysWithoutHolidays}
          currentCras={craFound.map(craMapper)}
          defaultTJM={defaultTJM}
          startups={[...session.user.data.startups, ...session.user.data.oldStartups]}
        />
      </ClientOnly>
    </CenteredContainer>
  );
};

export default CRAPage;
