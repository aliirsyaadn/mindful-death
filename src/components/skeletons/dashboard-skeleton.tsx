"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Plan Type Badge */}
        <div className="text-center mb-6">
          <Skeleton className="h-9 w-36 mx-auto rounded-full" />
        </div>

        {/* Main Countdown */}
        <section className="mb-12">
          <div className="glass-card rounded-3xl p-8 md:p-12 bg-white shadow-xl border border-zinc-200">
            <Skeleton className="h-4 w-40 mx-auto mb-4" />

            {/* Countdown numbers */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex flex-col items-center">
                <Skeleton className="h-20 md:h-28 w-24 md:w-36 rounded-xl" />
                <Skeleton className="h-4 w-10 mt-2" />
              </div>
              <Skeleton className="h-16 w-4" />
              <div className="flex flex-col items-center">
                <Skeleton className="h-20 md:h-28 w-16 md:w-20 rounded-xl" />
                <Skeleton className="h-4 w-8 mt-2" />
              </div>
              <Skeleton className="h-16 w-4" />
              <div className="flex flex-col items-center">
                <Skeleton className="h-20 md:h-28 w-16 md:w-20 rounded-xl" />
                <Skeleton className="h-4 w-10 mt-2" />
              </div>
              <Skeleton className="h-16 w-4" />
              <div className="flex flex-col items-center">
                <Skeleton className="h-20 md:h-28 w-16 md:w-20 rounded-xl" />
                <Skeleton className="h-4 w-10 mt-2" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 bg-white border border-zinc-200"
            >
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </section>

        {/* Goals Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>

          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
            ))}
          </div>
        </section>

        {/* Milestones Section */}
        <section className="mb-12">
          <Skeleton className="h-7 w-36 mb-6" />
          <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
