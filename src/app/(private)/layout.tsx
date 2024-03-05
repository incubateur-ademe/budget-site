import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

import { auth } from "@/lib/next-auth/auth";

const PrivateLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  return <>{children}</>;
};

export default PrivateLayout;
