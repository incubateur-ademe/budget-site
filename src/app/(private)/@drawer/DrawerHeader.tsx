"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { type ReactNode } from "react";

import { Container, Grid, GridCol } from "@/dsfr";

import { useDrawerStore } from "./DrawerStoreProvider";

export interface DrawerHeaderProps {
  closeButton?: boolean;
  text: ReactNode;
}

export const DrawerHeader = ({ text, closeButton }: DrawerHeaderProps) => {
  const open = useDrawerStore(store => store.open);

  return (
    <Container as="header">
      <Grid valign="middle" haveGutters>
        <GridCol base={closeButton ? 10 : 12}>
          <h1 className={fr.cx("fr-m-0")}>{text}</h1>
        </GridCol>
        {closeButton && (
          <GridCol base={2}>
            <Button className={fr.cx("fr-btn--close")} title="Fermer le panneau" onClick={() => open(false)}>
              Fermer
            </Button>
          </GridCol>
        )}
        <GridCol>
          <hr />
        </GridCol>
      </Grid>
    </Container>
  );
};
