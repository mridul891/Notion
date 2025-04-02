import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const Logo = () => {
  return (
    <div className="flex items-center gap-x-2">
      <Image 
        src="/logo.svg" 
        height={40} 
        width={40} 
        alt="logo" 
        className="dark:hidden w-10 h-10 sm:w-12 sm:h-12"
      />
      <Image 
        src="/logo-dark.svg" 
        height={40} 
        width={40} 
        alt="logo" 
        className="light:hidden w-10 h-10 sm:w-12 sm:h-12"
      />
      <p className={cn("font-semibold", font.className, "text-lg sm:text-xl")}>Jotion</p>
    </div>
  );
};
