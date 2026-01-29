"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function GoalsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center"
              >
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* Filter */}
        <section className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 rounded-full"
                style={{ width: `${60 + Math.random() * 40}px` }}
              />
            ))}
          </div>
        </section>

        {/* Goals List */}
        <section>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-4 bg-white border border-zinc-200"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="h-6 w-6 rounded-full mt-1" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full max-w-xs mb-2" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
