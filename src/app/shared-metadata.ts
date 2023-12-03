import { type Metadata } from "next";

import { config } from "@/config";

const description =
  "Carte Verte s’inscrit dans un objectif de politique publique de réduction de l’empreinte environnementale des français et pose le constat suivant : l’empreinte environnementale de la consommation (“je mange”, “j’achète”) des citoyens est trop élevée et peu de dispositifs existent pour l’abaisser (contrairement aux champs des transports et du logement).";

export const sharedMetadata: Metadata = {
  description,
  openGraph: {
    description,
    type: "website",
    locale: "fr_FR",
    countryName: "France",
    siteName: "Carte Verte",
    images: [
      {
        url: new URL(`/img/hero.svg`, config.host),
        alt: "Carte Verte",
      },
    ],
  },
};
