"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-primary text-white hover:bg-zinc-800 focus:ring-primary":
              variant === "primary",
            "bg-secondary text-white hover:bg-red-600 focus:ring-secondary":
              variant === "secondary",
            "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary":
              variant === "outline",
            "text-primary hover:bg-zinc-100 focus:ring-primary":
              variant === "ghost",
          },
          {
            "px-3 py-1.5 text-sm rounded-md": size === "sm",
            "px-5 py-2.5 text-base rounded-lg": size === "md",
            "px-8 py-4 text-lg rounded-xl": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
