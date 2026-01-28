"use client";

import { useState, useEffect } from "react";
import { formatNumber } from "@/lib/calculator";

interface LiveCountdownProps {
  targetDate: Date;
  label?: string;
  showSeconds?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
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

export function LiveCountdown({
  targetDate,
  label,
  showSeconds = true,
  size = "lg",
}: LiveCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
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

  return (
    <div className="text-center">
      {label && (
        <p className="text-zinc-500 mb-2 text-sm uppercase tracking-wider font-medium">
          {label}
        </p>
      )}

      <div className="flex items-center justify-center gap-2 md:gap-4">
        {/* Days */}
        <div className="flex flex-col items-center">
          <span className={`${sizeClasses[size]} font-extrabold countdown-number text-zinc-900`}>
            {formatNumber(timeLeft.days)}
          </span>
          <span className={`${labelSizeClasses[size]} text-zinc-500 font-medium`}>hari</span>
        </div>

        <span className={`${sizeClasses[size]} text-zinc-300 font-light`}>:</span>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <span className={`${sizeClasses[size]} font-extrabold countdown-number text-zinc-900`}>
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className={`${labelSizeClasses[size]} text-zinc-500 font-medium`}>jam</span>
        </div>

        <span className={`${sizeClasses[size]} text-zinc-300 font-light`}>:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <span className={`${sizeClasses[size]} font-extrabold countdown-number text-zinc-900`}>
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className={`${labelSizeClasses[size]} text-zinc-500 font-medium`}>menit</span>
        </div>

        {showSeconds && (
          <>
            <span className={`${sizeClasses[size]} text-zinc-300 font-light`}>:</span>
            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className={`${sizeClasses[size]} font-extrabold countdown-number text-red-500`}>
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className={`${labelSizeClasses[size]} text-zinc-500 font-medium`}>detik</span>
            </div>
          </>
        )}
      </div>
    </div>
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
  return (
    <div className="text-center">
      {label && (
        <p className="text-zinc-500 mb-1 text-xs uppercase tracking-wider font-medium">
          {label}
        </p>
      )}
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-5xl md:text-6xl font-extrabold countdown-number text-zinc-900">
          {formatNumber(daysRemaining)}
        </span>
        <span className="text-lg text-zinc-500 font-medium">hari</span>
      </div>
    </div>
  );
}
