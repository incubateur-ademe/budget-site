import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { format } from "date-fns";
import { capitalize } from "lodash";
import { z } from "zod";

import { config } from "@/config";
import { Box, CenteredContainer } from "@/dsfr";
import { auth } from "@/lib/next-auth/auth";
import { getWorkingDaysForMonth } from "@/utils/date";

import { saveCRA } from "./actions";

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
    month: string;
  };
}

const CRAPage = async ({ params: { month } }: CRAPageProps) => {
  const parsedMonth = yearMonthSchema.safeParse(month);

  if (!parsedMonth.success) {
    return (
      <CenteredContainer py="8w">
        <Alert severity="error" title="Mauvaise date" description={parsedMonth.error.errors[0].message} />
      </CenteredContainer>
    );
  }

  const monthDate = parsedMonth.data;

  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const businessDaysWithoutHolidays = getWorkingDaysForMonth(monthDate);

  return (
    <CenteredContainer py="4w">
      <h1>Compte Rendu d'Activité pour {capitalize(format(monthDate, "MMMM yyyy"))}</h1>
      <Box>
        <form action={saveCRA}>
          <Input
            label="Nombre de jours travaillés"
            hintText={
              <>
                Max : <strong>{businessDaysWithoutHolidays}</strong>, jours fériés exclus
              </>
            }
            nativeInputProps={{
              name: "workingDays",
              defaultValue: businessDaysWithoutHolidays,
              type: "number",
              min: 0,
              max: businessDaysWithoutHolidays,
              step: 0.5,
            }}
          />
          <Select
            label="Startup"
            nativeSelectProps={{
              name: "startupId",
              defaultValue: session.user.startups[0].id,
            }}
          >
            {session.user.startups.map(startup => (
              <option key={startup.id} value={startup.id}>
                {startup.name}
              </option>
            ))}
          </Select>
          <Button type="submit">Déclarer</Button>
        </form>
      </Box>
    </CenteredContainer>
  );
};

export default CRAPage;
