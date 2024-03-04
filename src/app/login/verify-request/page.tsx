import artworkMailSendSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/digital/mail-send.svg";
import { type StaticImageData } from "next/image";

import { SystemMessageDisplay } from "@/app/SystemMessageDisplay";

const VerifyRequestPage = () => (
  <SystemMessageDisplay
    code="custom"
    title="Connexion site du Budget"
    headline="Email envoyé !"
    body={
      <>
        <p>
          Un email de vérification a été envoyé à l'adresse que vous avez renseignée. Veuillez vérifier votre boîte mail
          et cliquer sur le lien pour valider votre adresse email.
        </p>
        <p>En cas d'adresse ADEME, vérifiez également les spams dans Mailinblack.</p>
      </>
    }
    noRedirect
    pictogram={artworkMailSendSvgUrl as StaticImageData}
  />
);

export default VerifyRequestPage;
