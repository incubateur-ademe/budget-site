"use client";

import { MainNavigation, type MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useSelectedLayoutSegment, useSelectedLayoutSegments } from "next/navigation";
import { useSession } from "next-auth/react";

export const Navigation = () => {
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();

  const { data: session, status } = useSession();

  const isLogged = status === "authenticated";
  const isMembre = isLogged && session?.user.type === "Membre";

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
        ...(isMembre
          ? [
              {
                text: "Gérer vos CRA",
                isActive: segment === "cra",
                linkProps: {
                  href: "/cra",
                },
              } satisfies MainNavigationProps["items"][number],
            ]
          : []),
      ]}
    />
  );
};
