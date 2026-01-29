"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Calendar,
  Target,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { getUserData, hasSetup, updateUserData, clearAllData } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MotionFadeUp } from "@/components/motion";
import { LanguageSwitcher } from "@/components/navigation";
import type { UserData, PlanType } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("settings");
  const tc = useTranslations("common");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [planType, setPlanType] = useState<PlanType>("death");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!hasSetup()) {
      router.push("/");
      return;
    }
    const data = getUserData();
    if (data) {
      setUserData(data);
      if (data.assessment) {
        setAge(data.assessment.age);
        setGender(data.assessment.gender);
      }
      setPlanType(data.planType);
      setBirthDate(data.birthDate || "");
    }
  }, [router]);

  const handleSave = async () => {
    if (!userData) return;

    setIsSaving(true);

    const updatedData: UserData = {
      ...userData,
      assessment: {
        ...userData.assessment!,
        age,
        gender,
      },
      planType,
      birthDate: birthDate || undefined,
    };

    updateUserData(updatedData);
    setUserData(updatedData);

    // Small delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    router.push("/dashboard");
  };

  const handleExportData = () => {
    if (!userData) return;
    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindfuldeath-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as UserData;
        if (imported.assessment && imported.goals) {
          updateUserData(imported);
          setUserData(imported);
          setAge(imported.assessment.age);
          setGender(imported.assessment.gender);
          setPlanType(imported.planType);
          setBirthDate(imported.birthDate || "");
          alert(t("importSuccess"));
        } else {
          alert(t("importInvalidFormat"));
        }
      } catch {
        alert(t("importError"));
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllData = () => {
    clearAllData();
    router.push("/");
  };

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-600" />
              </Link>
              <h1 className="font-bold text-xl text-zinc-900">{t("title")}</h1>
            </div>
            <LanguageSwitcher variant="light" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Profile Section */}
        <MotionFadeUp>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              {t("profile")}
            </h2>
            <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200 space-y-6">
              {/* Age with Slider */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-4">
                  {t("currentAge")}
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[age]}
                    onValueChange={(value) => setAge(value[0])}
                    min={18}
                    max={80}
                    step={1}
                    className="flex-1"
                  />
                  <motion.span
                    key={age}
                    initial={{ scale: 1.2, color: "#18181b" }}
                    animate={{ scale: 1, color: "#18181b" }}
                    className="text-2xl font-bold text-zinc-900 w-12 text-center"
                  >
                    {age}
                  </motion.span>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  {t("gender")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["male", "female"].map((g) => (
                    <motion.button
                      key={g}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGender(g as "male" | "female")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        gender === g
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {g === "male" ? tc("male") : tc("female")}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  {t("birthDate")}{" "}
                  <span className="text-zinc-400 font-normal">{t("birthDateHelp")}</span>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </section>
        </MotionFadeUp>

        {/* Plan Type Section */}
        <MotionFadeUp delay={0.1}>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t("planType")}
            </h2>
            <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "death", label: t("deathPlan"), desc: t("deathPlanDesc") },
                  { value: "retirement", label: t("retirementPlan"), desc: t("retirementPlanDesc") },
                ].map((plan) => (
                  <motion.button
                    key={plan.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPlanType(plan.value as PlanType)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      planType === plan.value
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <p className="font-semibold">{plan.label}</p>
                    <p className="text-xs opacity-70 mt-1">{plan.desc}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </section>
        </MotionFadeUp>

        {/* Data Management */}
        <MotionFadeUp delay={0.2}>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t("dataManagement")}
            </h2>
            <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200 space-y-3">
              {/* Export */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleExportData}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors text-left"
              >
                <Download className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="font-medium text-zinc-900">{t("exportData")}</p>
                  <p className="text-sm text-zinc-500">{t("exportDataDesc")}</p>
                </div>
              </motion.button>

              {/* Import */}
              <motion.label
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="font-medium text-zinc-900">{t("importData")}</p>
                  <p className="text-sm text-zinc-500">{t("importDataDesc")}</p>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </motion.label>
            </div>
          </section>
        </MotionFadeUp>

        {/* Danger Zone */}
        <MotionFadeUp delay={0.3}>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {t("dangerZone")}
            </h2>
            <div className="glass-card rounded-2xl p-6 bg-red-50 border border-red-200">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-100 transition-colors text-left">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700">{t("deleteAllData")}</p>
                      <p className="text-sm text-red-600">
                        {t("deleteAllDataDesc")}
                      </p>
                    </div>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <AlertDialogTitle className="text-center">
                      {t("deleteConfirmTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      {t("deleteConfirmDesc")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllData}>
                      {tc("delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>
        </MotionFadeUp>

        {/* Save Button */}
        <MotionFadeUp delay={0.4}>
          <Button
            onClick={handleSave}
            loading={isSaving}
            size="lg"
            className="w-full"
          >
            {isSaving ? t("saving") : t("saveChanges")}
          </Button>
        </MotionFadeUp>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-zinc-500"
        >
          <p>{t("totalGoals")}: {userData.goals.length}</p>
          <p>
            {t("createdAt")}:{" "}
            {new Date(userData.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
              dateStyle: "long",
            })}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
