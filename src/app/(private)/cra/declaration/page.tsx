import "./Calendar.scss";

import { CenteredContainer } from "@/dsfr";
import { craTable, missionTable } from "@/lib/airtable/client";
import { craMapper } from "@/lib/mapper/CRA";
import { missionMapper } from "@/lib/mapper/mission";
import { auth } from "@/lib/next-auth/auth";

import { CalendarCRA } from "./CalendarCRA";

const CRAListPage = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }

  const userID = session.user.id;
  const rawCRAList = await craTable
    .select(
      {
        filterByFormula: `{_MembreID} = "${userID}"`,
      },
      {
        next: {
          tags: [
            "CRA",
            `CRA:Membre:${userID}`,
            `Membre:${userID}`,
            ...session.user.data.startups.map(({ id }) => `Startup:${id}`),
          ],
        },
      },
    )
    .all();

  const craList = rawCRAList.map(craMapper);

  const rawMissions = await missionTable
    .select(
      {
        filterByFormula: `{_MembreID} = "${userID}"`,
      },
      {
        next: {
          tags: [
            "CRA",
            `CRA:Membre:${userID}`,
            `Membre:${userID}`,
            ...session.user.data.startups.map(({ id }) => `Startup:${id}`),
          ],
        },
      },
    )
    .all();
  const missionList = rawMissions.map(missionMapper);

  return (
    <CenteredContainer py="4w">
      <h2>Gérer vos CRA</h2>
      <p>Complétez vos compte-rendus d'activité du mois et retrouvez tous les CRA passés.</p>
      <CalendarCRA craList={craList} missionList={missionList} />
    </CenteredContainer>
  );
};

export default CRAListPage;
