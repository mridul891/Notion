import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import axios from "axios";

export function DialogComponent({ open, onOpenChange,setReFreshFetchDocuments ,selectedParentId}) {
  const [value, setValue] = useState("");
  const { data: session } = useSession();

  const handleCreate = async () => {
    if (!session?.user?.email) {
      toast.error("Please sign in to create documents");
      return;
    }

    if (!value.trim()) {
      toast.error("Please enter a title for the document");
      return;
    }

    try {
      await axios.post("/api/documents/create", {
        title: value,
        userId: session.user.email,
        parentDocument: selectedParentId,
      });
      toast.success("New note Created!");
      setReFreshFetchDocuments((prev) => !prev);
      onOpenChange(false)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("documents:refresh"));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
        console.error("Axios error:", error);
      } else {
        console.error("Unknown error:", error);
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter document title..."
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button onClick={() => handleCreate()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
