"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Heading = () => {
  return (
    <div className=" max-w-3xl  ">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas , Documents & Plans . Unified. Welcome to{" "}
        <span className="underline">Jotion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium md:mt-5">
        Jotion is the Connected Workspace <br /> better , faster work happens{" "}
      </h3>
      <Button className="font-bold mt-2">
        Enter Jotion
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default Heading;
