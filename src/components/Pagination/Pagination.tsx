import { ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
//   if (totalPages <= 1) return null;

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4 md:gap-8", className)}>
      <span className="text-off-white text-12 md:text-14 font-bold">
        Página
      </span>
      <div className="flex flex-row gap-1 md:gap-2 items-center">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className="text-button-primary hover:text-off-white text-12 md:text-14 font-bold px-2"
          >
            <ChevronDown className="text-button-primary w-4 h-4 rotate-90" />
          </button>
        )}
        {currentPage > 2 && (
          <span className="text-line text-10 md:text-12">...</span>
        )}
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
          const startPage = Math.max(1, currentPage - 1);
          const p = startPage + i;
          if (p > totalPages) return null;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-1.5 md:px-2 py-1 text-10 md:text-12 font-bold rounded transition-colors ${
                p === currentPage
                  ? "bg-button-primary text-background"
                  : "text-line hover:bg-inner"
              }`}
            >
              {p}
            </button>
          );
        })}
        {currentPage < totalPages - 1 && (
          <span className="text-line text-10 md:text-12">...</span>
        )}
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className="text-button-primary hover:text-off-white text-12 md:text-14 font-bold px-2"
          >
            <ChevronDown className="text-button-primary w-4 h-4 -rotate-90" />
          </button>
        )}
      </div>
    </div>
  );
}
