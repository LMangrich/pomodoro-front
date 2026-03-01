import { cn } from "@/src/lib/utils";;
import { ReactNode } from "react";

interface HeroBoxProps {
  illustration: ReactNode;
  title: string;
  titleClassName?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  innerClassName?: string;
  illustrationClassName?: string;
  contentClassName?: string;
}

export const HeroBox = ({
  illustration,
  title,
  description,
  actions,
  className,
  innerClassName,
  titleClassName,
  illustrationClassName,
  contentClassName,
}: HeroBoxProps) => {
  return (
    <div className={cn("px-5 w-full mx-auto h-full rounded-[20px]",
        "bg-primary border border-border p-4 md:p-8",
        className
      )}>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 h-full", innerClassName)}>
        <div className={cn("w-full max-w-[483px]  mx-auto h-full rounded-[20px] md:p-4",
            "bg-inner flex items-center justify-center",
            illustrationClassName
          )}
        >
          {illustration}
        </div>

        <div className={cn(
            "flex flex-col gap-4 mx-auto items-center justify-center",
            contentClassName
          )}
        >
          <h1 className={cn("text-30 md:text-48 font-bold text-off-white text-center leading-[1.1]", titleClassName)}>
            {title}
          </h1>
          {description &&
            <p className="text-center text-16 md:text-20 text-off-white px-4 leading-tight">
                {description}
            </p>
          }

          {actions && <div className="flex flex-row gap-4 mt-4 mb-4 md:mb-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
};
