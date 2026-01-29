"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { ReactNode, forwardRef } from "react";
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  cardVariants,
  fadeUp,
  scaleIn,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

// Animated page wrapper with entrance/exit animations
interface MotionPageProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export const MotionPage = forwardRef<HTMLDivElement, MotionPageProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionPage.displayName = "MotionPage";

// Stagger container for lists
interface MotionListProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const MotionList = forwardRef<HTMLDivElement, MotionListProps>(
  ({ children, className, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: delay,
            },
          },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionList.displayName = "MotionList";

// Stagger item for children in a list
interface MotionItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export const MotionItem = forwardRef<HTMLDivElement, MotionItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={staggerItem}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionItem.displayName = "MotionItem";

// Animated card with hover effects
interface MotionCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  enableHover?: boolean;
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ children, className, enableHover = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        whileHover={enableHover ? "hover" : undefined}
        whileTap={enableHover ? "tap" : undefined}
        variants={cardVariants}
        className={cn("cursor-default", className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionCard.displayName = "MotionCard";

// Fade up animation wrapper
interface MotionFadeUpProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const MotionFadeUp = forwardRef<HTMLDivElement, MotionFadeUpProps>(
  ({ children, className, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0, y: 30 },
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
              delay,
            },
          },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionFadeUp.displayName = "MotionFadeUp";

// Scale in animation wrapper
interface MotionScaleInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const MotionScaleIn = forwardRef<HTMLDivElement, MotionScaleInProps>(
  ({ children, className, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0, scale: 0.9 },
          animate: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              delay,
            },
          },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionScaleIn.displayName = "MotionScaleIn";

// Section wrapper with scroll-triggered animation
interface MotionSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  className?: string;
}

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
        {...props}
      >
        {children}
      </motion.section>
    );
  }
);
MotionSection.displayName = "MotionSection";

// Re-export AnimatePresence for convenience
export { AnimatePresence };
