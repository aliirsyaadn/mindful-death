"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Target,
  TrendingUp,
  BookOpen,
  Check,
  Trash2,
  Edit2,
  X,
  ChevronDown,
} from "lucide-react";
import { getUserData, hasSetup, saveGoal, deleteGoal, toggleGoalComplete } from "@/lib/storage";
import { GOAL_CATEGORIES } from "@/lib/research-data";
import type { UserData, Goal, GoalCategory } from "@/types";

export default function GoalsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<GoalCategory | "all">("all");

  // Form state
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState<GoalCategory>("pengalaman");
  const [newGoalTargetAge, setNewGoalTargetAge] = useState<number | undefined>();

  useEffect(() => {
    setMounted(true);
    if (!hasSetup()) {
      router.push("/");
      return;
    }
    setUserData(getUserData());
  }, [router]);

  const filteredGoals = useMemo(() => {
    if (!userData) return [];
    if (filter === "all") return userData.goals;
    return userData.goals.filter((g) => g.category === filter);
  }, [userData, filter]);

  const goalStats = useMemo(() => {
    if (!userData) return { total: 0, completed: 0, byCategory: {} as Record<string, number> };
    const byCategory: Record<string, number> = {};
    userData.goals.forEach((g) => {
      byCategory[g.category] = (byCategory[g.category] || 0) + 1;
    });
    return {
      total: userData.goals.length,
      completed: userData.goals.filter((g) => g.completed).length,
      byCategory,
    };
  }, [userData]);

  const handleSaveGoal = () => {
    if (!newGoalTitle.trim()) return;

    const goal: Goal = {
      id: editingGoal?.id || crypto.randomUUID(),
      title: newGoalTitle.trim(),
      description: newGoalDescription.trim() || undefined,
      category: newGoalCategory,
      targetAge: newGoalTargetAge,
      completed: editingGoal?.completed || false,
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
    };

    saveGoal(goal);
    setUserData(getUserData());
    resetForm();
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm("Hapus goal ini?")) {
      deleteGoal(goalId);
      setUserData(getUserData());
    }
  };

  const handleToggleComplete = (goalId: string) => {
    toggleGoalComplete(goalId);
    setUserData(getUserData());
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoalTitle(goal.title);
    setNewGoalDescription(goal.description || "");
    setNewGoalCategory(goal.category);
    setNewGoalTargetAge(goal.targetAge);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingGoal(null);
    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalCategory("pengalaman");
    setNewGoalTargetAge(undefined);
  };

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-bold text-xl text-zinc-900">
              MindfulDeath
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Goal
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center">
              <p className="text-3xl font-bold text-zinc-900">{goalStats.total}</p>
              <p className="text-sm text-zinc-500">Total Goals</p>
            </div>
            <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center">
              <p className="text-3xl font-bold text-green-600">{goalStats.completed}</p>
              <p className="text-sm text-zinc-500">Tercapai</p>
            </div>
            <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center">
              <p className="text-3xl font-bold text-amber-600">
                {goalStats.total - goalStats.completed}
              </p>
              <p className="text-sm text-zinc-500">Belum</p>
            </div>
          </div>
        </section>

        {/* Filter */}
        <section className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === "all"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Semua ({goalStats.total})
            </button>
            {GOAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === cat.id
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {cat.icon} {cat.label} ({goalStats.byCategory[cat.id] || 0})
              </button>
            ))}
          </div>
        </section>

        {/* Goals List */}
        <section>
          {filteredGoals.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 bg-white border border-zinc-200 text-center">
              <Target className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {filter === "all" ? "Belum ada goals" : `Belum ada goals di kategori ini`}
              </h3>
              <p className="text-zinc-600 mb-4">
                Mulai dengan menambahkan apa yang ingin kamu capai.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Buat Goal Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGoals.map((goal) => {
                const category = GOAL_CATEGORIES.find((c) => c.id === goal.category);
                return (
                  <div
                    key={goal.id}
                    className={`glass-card rounded-xl p-4 bg-white border transition-all ${
                      goal.completed ? "border-green-200 bg-green-50/50" : "border-zinc-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleComplete(goal.id)}
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          goal.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-zinc-300 hover:border-zinc-400"
                        }`}
                      >
                        {goal.completed && <Check className="w-4 h-4" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3
                              className={`font-medium ${
                                goal.completed ? "text-zinc-500 line-through" : "text-zinc-900"
                              }`}
                            >
                              {goal.title}
                            </h3>
                            {goal.description && (
                              <p className="text-sm text-zinc-500 mt-1">{goal.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-600">
                                {category?.icon} {category?.label}
                              </span>
                              {goal.targetAge && (
                                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                                  Target: {goal.targetAge} tahun
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditGoal(goal)}
                              className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-zinc-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900">
                {editingGoal ? "Edit Goal" : "Tambah Goal Baru"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Judul Goal *
                </label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Contoh: Naik gunung Rinjani"
                  className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Deskripsi (opsional)
                </label>
                <textarea
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                  placeholder="Detail lebih lanjut tentang goal ini..."
                  rows={3}
                  className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Kategori
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GOAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewGoalCategory(cat.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        newGoalCategory === cat.id
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <p className="text-sm font-medium text-zinc-900 mt-1">{cat.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Age */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Target Usia (opsional)
                </label>
                <input
                  type="number"
                  value={newGoalTargetAge || ""}
                  onChange={(e) =>
                    setNewGoalTargetAge(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  placeholder="Contoh: 35"
                  min={userData.assessment?.age || 18}
                  max={100}
                  className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:outline-none transition-colors"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Kapan kamu ingin mencapai goal ini?
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={resetForm}
                className="flex-1 py-3 px-4 bg-zinc-100 text-zinc-700 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveGoal}
                disabled={!newGoalTitle.trim()}
                className="flex-1 py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingGoal ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 pb-safe">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Dashboard</span>
            </Link>
            <Link
              href="/goals"
              className="flex flex-col items-center gap-1 text-zinc-900"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">Goals</span>
            </Link>
            <Link
              href="/research"
              className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-medium">Riset</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
