"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatNumber } from "@/lib/calculator";
import { useTranslations } from "next-intl";

interface LiveCountdownProps {
  targetDate: Date;
  label?: string;
  showSeconds?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  enablePulse?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 };
  }

  const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days: totalDays, hours, minutes, seconds, totalDays };
}

// Animated number component with flip effect
function AnimatedNumber({
  value,
  className,
  format = false,
}: {
  value: number | string;
  className?: string;
  format?: boolean;
}) {
  const displayValue = format && typeof value === "number" ? formatNumber(value) : value;

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayValue}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className={className}
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Pulse animation for seconds
function PulsingNumber({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.1, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 25,
      }}
      className={className}
    >
      {value}
    </motion.span>
  );
}

export function LiveCountdown({
  targetDate,
  label,
  showSeconds = true,
  size = "lg",
  enablePulse = true,
}: LiveCountdownProps) {
  const t = useTranslations("common");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);
  const prevSecondsRef = useRef(timeLeft.seconds);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      prevSecondsRef.current = newTimeLeft.seconds;
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-zinc-200 rounded-lg"></div>
      </div>
    );
  }

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl md:text-7xl",
    xl: "text-7xl md:text-9xl",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const separatorSizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl md:text-6xl",
    xl: "text-6xl md:text-8xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center"
    >
      {label && (
        <p className="text-zinc-500 mb-2 text-sm uppercase tracking-wider font-medium">
          {label}
        </p>
      )}

      <div className="flex items-center justify-center gap-2 md:gap-4">
        {/* Days */}
        <div className="flex flex-col items-center">
          <AnimatedNumber
            value={timeLeft.days}
            format={true}
            className={`${sizeClasses[size]} font-extrabold countdown-number text-zinc-900`}
          />
          <span className={`${labelSizeClasses[size]} text-zinc-500 font-medium`}>{t("days")}</span>
        </div>

        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className={`${separatorSizeClasses[size]} text-zinc-300 font-light`}
        >
          :
        </motion.span>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <AnimatedNumber
            value={String(timeLeft.hours).padStart(2, "0")}
            className={`${sizeClasses[size]} font-extrabold countdown-number text-zinc-900`}
          />
          <span className={`${labelSizeClasses[size]} text-zinc-500 font-medium`}>{t("hours")}</span>
        </div>

        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className={`${separatorSizeClasses[size]} text-zinc-300 font-light`}
        >
          :
        </motion.span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <AnimatedNumber
            value={String(timeLeft.minutes).padStart(2, "0")}
            className={`${sizeClasses[size]} font-extrabold countdown-number text-zinc-900`}
          />
          <span className={`${labelSizeClasses[size]} text-zinc-500 font-medium`}>{t("minutes")}</span>
        </div>

        {showSeconds && (
          <>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className={`${separatorSizeClasses[size]} text-zinc-300 font-light`}
            >
              :
            </motion.span>
            {/* Seconds */}
            <div className="flex flex-col items-center">
              {enablePulse ? (
                <PulsingNumber
                  value={String(timeLeft.seconds).padStart(2, "0")}
                  className={`${sizeClasses[size]} font-extrabold countdown-number text-red-500`}
                />
              ) : (
                <AnimatedNumber
                  value={String(timeLeft.seconds).padStart(2, "0")}
                  className={`${sizeClasses[size]} font-extrabold countdown-number text-red-500`}
                />
              )}
              <span className={`${labelSizeClasses[size]} text-zinc-500 font-medium`}>{t("seconds")}</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Simple days-only countdown for compact display
export function DaysCountdown({
  daysRemaining,
  label,
}: {
  daysRemaining: number;
  label?: string;
}) {
  const t = useTranslations("common");
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      {label && (
        <p className="text-zinc-500 mb-1 text-xs uppercase tracking-wider font-medium">
          {label}
        </p>
      )}
      <div className="flex items-baseline justify-center gap-2">
        <motion.span
          key={daysRemaining}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          className="text-5xl md:text-6xl font-extrabold countdown-number text-zinc-900"
        >
          {formatNumber(daysRemaining)}
        </motion.span>
        <span className="text-lg text-zinc-500 font-medium">{t("days")}</span>
      </div>
    </motion.div>
  );
}
