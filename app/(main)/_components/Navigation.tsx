"use client";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ChevronLeft, MenuIcon, PlusCircle, Search } from "lucide-react";
import { ComponentRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItems from "./User-item";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Item } from "@/components/Item";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Post {
  id: string;
  title: string;
  children?: Post[];
  parentDocument?: string | null;
}

const Navigation = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const { data: session } = useSession();

  const isResizingRef = useRef(false);
  const sideBarRef = useRef<ComponentRef<"aside">>(null);
  const navBarRef = useRef<ComponentRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reFreshFetchDocuments, setReFreshFetchDocuments] = useState(false);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchDocuments();
    }
  }, [reFreshFetchDocuments, session?.user?.email]);

  const fetchDocuments = async () => {
    if (!session?.user?.email) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/documents/get`, {
        params: {
          userId: session.user.email,
        },
      });
      setPosts(response.data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (navBarRef.current && sideBarRef.current) {
      sideBarRef.current.style.width = `${newWidth}px`;
      navBarRef.current.style.setProperty("left", `${newWidth}px`);
      navBarRef.current.style.setProperty("width", `calc(100%-${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sideBarRef.current && navBarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sideBarRef.current.style.width = isMobile ? "100%" : "200px";
      navBarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100%-240px)"
      );
      navBarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
    }
    setTimeout(() => setIsResetting(false), 300);
  };

  const collapse = () => {
    if (sideBarRef.current && navBarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      sideBarRef.current.style.width = "0px";
      navBarRef.current.style.setProperty("width", "100%");
      navBarRef.current.style.setProperty("left", "0");

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreate = async () => {
    if (!session?.user?.email) {
      toast.error("Please sign in to create documents");
      return;
    }

    if (!newDocumentTitle.trim()) {
      toast.error("Please enter a title for the document");
      return;
    }

    try {
      await axios.post("/api/documents/create", {
        title: newDocumentTitle,
        userId: session.user.email,
        parentDocument: selectedParentId,
      });
      toast.success("New note Created!");
      setReFreshFetchDocuments((prev) => !prev);
      setIsDialogOpen(false);
      setNewDocumentTitle("");
      setSelectedParentId(null);
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

  const DocumentItem = ({ post, level = 0 }: { post: Post; level?: number }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = post.children && post.children.length > 0;

    return (
      <div>
        <div 
          className="group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-purple/5 flex items-center text-muted-foreground font-medium"
          style={{ paddingLeft: `${level * 12 + 12}px` }}
        >
          {hasChildren && (
            <div
              role="button"
              className="h-full hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              )}
            </div>
          )}
          <div 
            onClick={() => router.push(`/documents/${post.id}`)}
            className="flex-1 cursor-pointer"
          >
            {post.title}
          </div>
          <div className="ml-auto flex items-center gap-x-2">
            <Item
              onClick={() => {
                setSelectedParentId(post.id);
                setIsDialogOpen(true);
              }}
              label=""
              icon={PlusCircle}
            />
          </div>
        </div>
        {isExpanded && hasChildren && post.children && (
          <div className="mt-1 pl-3">
            {post.children.map((child) => (
              <DocumentItem key={child.id} post={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <aside
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
        ref={sideBarRef}
      >
        <div
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronLeft className="h-6 w-6" onClick={collapse} />
        </div>

        <div>
          <UserItems />
          <Item
            onClick={() => {
              setSelectedParentId(null);
              setIsDialogOpen(true);
            }}
            label="New Page"
            icon={PlusCircle}
          />
          <Item label="Search" icon={Search} onClick={() => {}} />
        </div>

        <div className="mt-2">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading documents...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No documents found
            </div>
          ) : (
            posts.map((post) => (
              <DocumentItem key={post.id} post={post} />
            ))
          )}
        </div>
        <div
          onMouseDown={handleOnMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>

      <div
        ref={navBarRef}
        className={cn(
          "absolute top-0 z-[9999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              role="button"
              className="h-6 w-6 text-muted-foreground mr-10"
              onClick={resetWidth}
            />
          )}
        </nav>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter document title..."
              value={newDocumentTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDocumentTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navigation;
