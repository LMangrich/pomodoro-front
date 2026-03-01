"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion = ({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("w-full bg-primary rounded-[20px] border border-border ", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 transition-colors"
      >
        <span className="text-16 md:text-18 tracking-tighter text-text-primary text-left font-bold">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-7 h-7 text-text-primary" />
        ) : (
          <ChevronDown className="w-7 h-7 text-text-primary" />
        )}
      </button>
      {isOpen && (
        <div className="mt-2 px-6 pb-6">
          <p className="text-inner-text-content text-14 md:text-16">
            {children}
          </p>
        </div>
      )}
    </div>
  );
};
