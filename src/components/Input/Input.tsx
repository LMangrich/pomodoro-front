import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/src/lib/utils";;

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  help?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, help, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && (
          <label htmlFor={props.id} className="text-12 font-bold text-off-white uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 rounded-[8px] bg-input border border-border",
            "text-off-white placeholder:text-line",
            "mt-2",
            "focus:outline-none focus:border-button-primary focus:ring-1 focus:ring-button-primary/50 transition-colors",
            error && "bg-error border-light-error focus:border-light-error focus:ring-light-error",
            className
          )}
          {...props}
        />
        {error && (
          <p className="absolute mt-1 text-sm text-light-error">{error}</p>
        )}
        {help && !error && (
          <p className="absolute mt-1 text-sm text-text-primary/70">{help}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
