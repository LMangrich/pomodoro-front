import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/src/lib/utils";;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "rounded-[8px] font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-button-primary border-2 border-button-primary text-background hover:opacity-90",
      secondary: "bg-transparent border-2 border-button-secondary text-button-secondary hover:bg-button-secondary hover:text-background",
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2 text-20",
      lg: "px-8 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
