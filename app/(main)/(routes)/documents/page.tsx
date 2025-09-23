"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DialogComponent } from "@/app/(main)/_components/DialogComponent";

const DoucmentsPage = () => {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParentId] = useState<string | null>(null);
  const [reFreshFetchDocuments, setReFreshFetchDocuments] = useState(false);

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

      <Button className="font-semibold" onClick={() => setIsDialogOpen(true)}>
        Create New Document
      </Button>

      {isDialogOpen ? (
        <DialogComponent
          open={true}
          onOpenChange={setIsDialogOpen}
          setReFreshFetchDocuments={setReFreshFetchDocuments}
          selectedParentId={selectedParentId}
        />
      ) : (
        <DialogComponent
          open={false}
          onOpenChange={setIsDialogOpen}
          setReFreshFetchDocuments={setReFreshFetchDocuments}
          selectedParentId={selectedParentId}
        />
      )}
    </div>
  );
};

export default DoucmentsPage;
