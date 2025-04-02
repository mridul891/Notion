"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Change to your target page
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 dark:bg-black dark:text-white transition-all duration-300">
      
      <h1 className="text-5xl font-bold tracking-tight">Access Restricted</h1>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
        Please log in to view this page.
      </p>
      <p className="mt-2 text-lg font-medium text-black dark:text-gray-200 animate-pulse">
        Redirecting in 5 seconds...
      </p>

    </div>
  );
};

export default RedirectPage;
