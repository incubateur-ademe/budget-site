import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";

import { NewMissionForm } from "@/app/(private)/mission/new/NewMissionForm";
import { Container } from "@/dsfr";
import { auth } from "@/lib/next-auth/auth";

import { DrawerHeader } from "../../DrawerHeader";

const DrawerMissionNewPage = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <Container as="aside" fluid className={cx("flex flex-col min-h-full", fr.cx("fr-mt-2w"))}>
      <DrawerHeader text="Nouvelle mission" closeButton />
      <NewMissionForm user={session.user.data} className="flex-1" />
    </Container>
  );
};

export default DrawerMissionNewPage;
