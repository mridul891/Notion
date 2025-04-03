import { auth } from "@/auth";
import RedirectPage from "@/components/Redirexct-Page";

import React from "react";
import Navigation from "./_components/Navigation";

const mainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    return <RedirectPage />;
  }
  return (
    <div className="h-full flex dark:bg-[#161616]">
      <Navigation/>
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default mainLayout;
