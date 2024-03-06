import { SystemMessageDisplay } from "@/app/SystemMessageDisplay";

const CRAConfirmationPage = () => (
  <SystemMessageDisplay
    code="custom"
    headline="Votre déclaration a été transmise"
    title="Confirmation"
    pictogram="calendar"
    redirectLink="/cra"
    redirectText="Retour aux CRA"
    body={
      <>
        L'intrapreneur·e de votre équipe doit maintenant la valider.
        <br />
        Vous recevrez un email pour vous en informer.
      </>
    }
  />
);

export default CRAConfirmationPage;
