import "./Calendar.scss";

import { CenteredContainer } from "@/dsfr";

import { CalendarCRA } from "./CalendarCRA";

const CRAListPage = () => {
  return (
    <CenteredContainer py="4w">
      <h1>Liste des CRAs</h1>
      <CalendarCRA />
    </CenteredContainer>
  );
};

export default CRAListPage;
