"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Target,
  Check,
  Trash2,
  Edit2,
} from "lucide-react";
import { getUserData, hasSetup, saveGoal, deleteGoal, toggleGoalComplete } from "@/lib/storage";
import { GOAL_CATEGORIES } from "@/lib/research-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoalsSkeleton } from "@/components/skeletons/goals-skeleton";
import { BottomNavbar, LanguageSwitcher } from "@/components/navigation";
import { MotionList, MotionItem, MotionFadeUp } from "@/components/motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { UserData, Goal, GoalCategory } from "@/types";

export default function GoalsPage() {
  const router = useRouter();
  const t = useTranslations("goals");
  const tc = useTranslations("common");
  const tCat = useTranslations("categories");

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
    deleteGoal(goalId);
    setUserData(getUserData());
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

  // Get translated category label
  const getCategoryLabel = (categoryId: string) => {
    return tCat(categoryId as any);
  };

  if (!mounted || !userData) {
    return <GoalsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-bold text-xl text-zinc-900">
              {tc("appName")}
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="light" />
              <Button onClick={() => setShowAddModal(true)} size="sm">
                <Plus className="w-4 h-4" />
                {t("addGoal")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <MotionFadeUp>
          <section className="mb-8">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-3 sm:gap-4"
            >
              {[
                { value: goalStats.total, label: t("totalGoals") },
                { value: goalStats.completed, label: t("achieved"), highlight: "green" },
                { value: goalStats.total - goalStats.completed, label: t("remaining"), highlight: "amber" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="glass-card rounded-2xl p-3 sm:p-5 bg-white border border-zinc-200 text-center"
                >
                  <p className={`text-2xl sm:text-3xl font-bold ${
                    stat.highlight === "green" ? "text-green-600" :
                    stat.highlight === "amber" ? "text-amber-600" :
                    "text-zinc-900"
                  }`}>
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-500">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </MotionFadeUp>

        {/* Filter */}
        <MotionFadeUp delay={0.1}>
          <section className="mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter("all")}
                className={`px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center ${
                  filter === "all"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {t("all")} ({goalStats.total})
              </motion.button>
              {GOAL_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center ${
                    filter === cat.id
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {cat.icon} {getCategoryLabel(cat.id)} ({goalStats.byCategory[cat.id] || 0})
                </motion.button>
              ))}
            </div>
          </section>
        </MotionFadeUp>

        {/* Goals List */}
        <section>
          {filteredGoals.length === 0 ? (
            <MotionFadeUp delay={0.2}>
              <div className="glass-card rounded-2xl p-8 bg-white border border-zinc-200 text-center">
                <Target className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  {filter === "all" ? t("noGoalsTitle") : t("noGoalsCategoryTitle")}
                </h3>
                <p className="text-zinc-600 mb-4">
                  {t("noGoalsDesc")}
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4" />
                  {t("createFirstGoal")}
                </Button>
              </div>
            </MotionFadeUp>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div className="space-y-3">
                {filteredGoals.map((goal) => {
                  const category = GOAL_CATEGORIES.find((c) => c.id === goal.category);
                  return (
                    <motion.div
                      key={goal.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`glass-card rounded-xl p-4 bg-white border transition-all ${
                        goal.completed ? "border-green-200 bg-green-50/50" : "border-zinc-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleComplete(goal.id)}
                          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            goal.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-zinc-300 hover:border-zinc-400"
                          }`}
                        >
                          <AnimatePresence>
                            {goal.completed && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <Check className="w-4 h-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>

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
                                  {category?.icon} {getCategoryLabel(goal.category)}
                                </span>
                                {goal.targetAge && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                                    {t("target")}: {goal.targetAge} {tc("years")}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditGoal(goal)}
                                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-zinc-400" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddModal} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? t("editGoal") : t("addNewGoal")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                {t("goalTitle")} *
              </label>
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder={t("goalTitlePlaceholder")}
                className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                {t("description")}
              </label>
              <textarea
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                rows={3}
                className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                {t("category")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GOAL_CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setNewGoalCategory(cat.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      newGoalCategory === cat.id
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <p className="text-sm font-medium text-zinc-900 mt-1">{getCategoryLabel(cat.id)}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Target Age */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                {t("targetAge")}
              </label>
              <input
                type="number"
                value={newGoalTargetAge || ""}
                onChange={(e) =>
                  setNewGoalTargetAge(e.target.value ? parseInt(e.target.value) : undefined)
                }
                placeholder={t("targetAgePlaceholder")}
                min={userData.assessment?.age || 18}
                max={100}
                className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:outline-none transition-colors"
              />
              <p className="text-xs text-zinc-500 mt-1">
                {t("targetAgeHelp")}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={resetForm} className="flex-1">
              {tc("cancel")}
            </Button>
            <Button
              onClick={handleSaveGoal}
              disabled={!newGoalTitle.trim()}
              className="flex-1"
            >
              {editingGoal ? tc("save") : tc("add")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
}
