"use client";

import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";
import { Drawer } from "vaul";

import { useBreakpoints } from "@/dsfr/hooks/useBreakpoints";

import { useDrawerStore } from "./@drawer/DrawerStoreProvider";
import styles from "./CustomDrawer.module.scss";

export const CustomDrawer = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { open, isOpen } = useDrawerStore(store => store);
  const { isLgAndUp } = useBreakpoints();

  return (
    <Drawer.Root shouldScaleBackground modal open={isOpen} direction={isLgAndUp ? "right" : "bottom"}>
      <Drawer.Portal>
        <Drawer.Overlay
          className={styles["custom-drawer__backdrop"]}
          onClick={() => {
            open(false);
          }}
        />
        <Drawer.Content
          onCloseAutoFocus={() => {
            router.back();
          }}
          className={cx(styles["custom-drawer"], {
            [styles["custom-drawer--bottom"]]: !isLgAndUp,
            [styles["custom-drawer--right"]]: isLgAndUp,
          })}
        >
          {!isLgAndUp && <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />}
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
