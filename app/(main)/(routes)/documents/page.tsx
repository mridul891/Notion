"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import { useState } from "react";

const DoucmentsPage = () => {
  const { data: session } = useSession();

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height={300}
        width={300}
        alt="Emptyimage"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height={300}
        width={300}
        alt="Emptyimage"
        className="hidden dark:block"
      />
      <h2 className="text-white text-lg font-medium">
        Welcome to {session?.user?.name}&apos;s Jotion{" "}
      </h2>

      <Button className="font-semibold ">
        <PlusCircle className="h-4 w-2 mr-1" />
        Create a note
      </Button>
    </div>
  );
};

export default DoucmentsPage;
