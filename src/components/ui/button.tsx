"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonAnimations = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-zinc-800",
        primary:
          "bg-primary text-primary-foreground hover:bg-zinc-800",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-red-600",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-red-600",
        outline:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
        ghost:
          "text-primary hover:bg-zinc-100",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3 py-1.5 text-sm rounded-md",
        md: "h-11 px-5 py-2.5 text-base rounded-lg",
        lg: "h-14 px-8 py-4 text-lg rounded-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animate?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      animate = true,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // When asChild is true, render Slot without loading spinner
    // Slot expects exactly one child element
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    // Motion animated button (default)
    if (animate) {
      return (
        <motion.button
          ref={ref}
          whileHover={!disabled && !loading ? buttonAnimations.hover : undefined}
          whileTap={!disabled && !loading ? buttonAnimations.tap : undefined}
          className={cn(buttonVariants({ variant, size, className }))}
          disabled={disabled || loading}
          {...(props as HTMLMotionProps<"button">)}
        >
          {loading && <LoadingSpinner />}
          {children}
        </motion.button>
      );
    }

    // Regular button without animation
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
