"use client";

import { MainNavigation, type MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useSelectedLayoutSegment, useSelectedLayoutSegments } from "next/navigation";
import { useSession } from "next-auth/react";

export const Navigation = () => {
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();

  const { data: session, status } = useSession();

  return (
    <MainNavigation
      items={[
        {
          text: "Accueil",
          linkProps: {
            href: "/",
          },
          isActive: !segment,
        },
        ...(status === "authenticated"
          ? ((): MainNavigationProps.Item[] => {
              switch (session.user.data.type) {
                case "Membre":
                  return [
                    {
                      text: "Gérer vos CRA",
                      isActive: segments.includes("cra") && segments.includes("declaration"),
                      linkProps: {
                        href: "/cra/declaration",
                      },
                    },
                  ];
                case "Intra":
                  return [
                    {
                      text: "Suivre les CRA",
                      isActive: segments.includes("cra") && segments.includes("validation"),
                      linkProps: {
                        href: "/cra/validation",
                      },
                    },
                    {
                      text: "Demander un devis",
                      isActive: segment === "cra",
                      linkProps: {
                        href: "#",
                      },
                    },
                  ];
                case "Gestionnaire":
                default:
                  return [];
              }
            })()
          : []),
      ]}
    />
  );
};
