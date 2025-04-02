import { auth } from "@/auth";
import RedirectPage from "@/components/Redirexct-Page";
import Spinner from "@/components/spinner";
import { redirect } from "next/navigation";
import React from "react";

const mainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    return (
      <RedirectPage />
    );
  }
  return <div>{children}</div>;
};

export default mainLayout;
