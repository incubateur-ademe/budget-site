import { redirect } from "next/navigation";
import { type PropsWithChildren, type ReactNode } from "react";

import { auth } from "@/lib/next-auth/auth";

import { DrawerStoreProvider } from "./@drawer/DrawerStoreProvider";
import { CustomDrawer } from "./CustomDrawer";

interface PrivateLayoutProps {
  drawer: ReactNode;
}

const PrivateLayout = async ({ children, drawer }: PropsWithChildren<PrivateLayoutProps>) => {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  return (
    <DrawerStoreProvider>
      {children}
      <CustomDrawer>{drawer}</CustomDrawer>
    </DrawerStoreProvider>
  );
};

export default PrivateLayout;
