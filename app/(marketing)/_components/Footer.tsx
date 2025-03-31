"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export const Footer = () => {
    return (<div className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#161618] ">
        <Logo />
        <div className="md:ml-auto w-full justify-around md:justify-end flex items-center gap-x-2 text-muted-foreground">
            <Button variant="ghost" size="sm" >
                Privacy Policy
            </Button>
            <Button variant="ghost" size="sm" >
                Terms & Conditions
            </Button>
        </div>
    </div>)
};
