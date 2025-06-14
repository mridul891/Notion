"use client";
import { cn } from "@/lib/utils";
import { ChevronLeft, MenuIcon, PlusCircle, Search } from "lucide-react";
import { ComponentRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItems from "./User-item";
// import { useSession } from "next-auth/react";
import axios from "axios";
import { Item } from "@/components/Item";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Post = { id: string; title: string };

const Navigation = () => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const isResizingRef = useRef(false);
  const sideBarRef = useRef<ComponentRef<"aside">>(null);
  const navBarRef = useRef<ComponentRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [posts, setPosts] = useState<Post[]>([]);
  // const { data: session } = useSession();
  const [reFreshFetchDocuments, setReFreshFetchDocuments] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, [reFreshFetchDocuments]);

  const fetchDocuments = async () => {
    const postName = await axios.get(`/api/documents/get`, {
      params: {
        // userId: session?.user?.id,
        userId: "abc123",
      },
    });
    console.log(postName);
    setPosts(postName.data.posts);
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
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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

  const Newdata = {
    title: "Getting Started with c++",
    userId: "abc123",
  };
  // used to create a new page

  const handleCreate = async (postId: string | null) => {
    try {
      await axios.post("/api/documents/create", {
        ...Newdata,
        parentDocument: postId || null,
      });
      toast.success("New note Created!");
      setReFreshFetchDocuments((prev) => !prev);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Now TypeScript knows error is of type AxiosError
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred.");
        }

        console.error("Axios error:", error);
      } else {
        // If it's not an Axios error
        console.error("Unknown error:", error);
        toast.error("Something went wrong.");
      }
    }
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
            onClick={() => handleCreate(null)}
            label="New Page"
            icon={PlusCircle}
          />
          <Item label="Search" icon={Search} onClick={() => {}} />
        </div>

        <div>
          {posts.map((post, index) => (
            <div key={index}>
              <div onClick={() => router.push(`/documents/${post.id}`)}>
                {post.title}
              </div>
              <Item
                onClick={() => handleCreate(post.id)}
                label=""
                icon={PlusCircle}
              />
            </div>
          ))}
        </div>
        {/* This is basically the element that used to change the width of the sidebar width */}
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
    </>
  );
};

export default Navigation;
