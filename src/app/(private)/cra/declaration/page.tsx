import "./Calendar.scss";

import { CenteredContainer } from "@/dsfr";
import { craTable } from "@/lib/airtable/client";
import { craMapper } from "@/lib/mapper/CRA";
import { auth } from "@/lib/next-auth/auth";

import { CalendarCRA } from "./CalendarCRA";

const CRAListPage = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }

  const userID = session.user.id;
  const userCRAList = await craTable
    .select({
      filterByFormula: `{_MembreID} = "${userID}"`,
    })
    .all();

  return (
    <CenteredContainer py="4w">
      <h2>Gérer vos CRA</h2>
      <p>Complétez vos compte-rendus d'activité du mois et retrouvez tous les CRA passés.</p>
      <CalendarCRA craList={userCRAList.map(craMapper)} />
    </CenteredContainer>
  );
};

export default CRAListPage;
