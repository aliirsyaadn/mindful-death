"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ResearchSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-12">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-2" />
          <Skeleton className="h-5 w-2/3 max-w-xl mx-auto" />
        </section>

        {/* Key Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center"
            >
              <Skeleton className="h-10 w-14 mx-auto mb-1" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </section>

        {/* Accordion Sections */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl bg-white border border-zinc-200 overflow-hidden"
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <section className="mt-12 max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl p-6 bg-amber-50 border border-amber-200">
            <Skeleton className="h-5 w-24 mb-2 bg-amber-200" />
            <Skeleton className="h-4 w-full mb-1 bg-amber-200" />
            <Skeleton className="h-4 w-full mb-1 bg-amber-200" />
            <Skeleton className="h-4 w-2/3 bg-amber-200" />
          </div>
        </section>
      </main>
    </div>
  );
}
