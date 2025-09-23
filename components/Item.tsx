"use client";

import { LucideIcon } from "lucide-react";

interface ItemProps {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  className?: string;
}
export function Item({ icon: Icon, onClick, label ,className }: ItemProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: "20px" }}
      className={`group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-purple/5 flex items-center  font-medium cursor-pointer ${className}`}
    >
      <Icon className="shrink-0 h-[18px] mr-2 " />
      <span className="truncate ">{label}</span>
    </div>
  );
}
