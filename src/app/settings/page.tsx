"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import type { UserData, PlanType } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleSave = () => {
    if (!userData) return;

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
    router.push("/dashboard");
  };

  const handleExportData = () => {
    if (!userData) return;
    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `happydeath-backup-${new Date().toISOString().split("T")[0]}.json`;
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
          alert("Data berhasil diimpor!");
        } else {
          alert("Format file tidak valid");
        }
      } catch {
        alert("Gagal membaca file");
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
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-600" />
            </Link>
            <h1 className="font-bold text-xl text-zinc-900">Pengaturan</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Profile Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profil
          </h2>
          <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200 space-y-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Usia Saat Ini
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-2xl font-bold text-zinc-900 w-12 text-center">
                  {age}
                </span>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    gender === "male"
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  Pria
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    gender === "female"
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  Wanita
                </button>
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Tanggal Lahir{" "}
                <span className="text-zinc-400 font-normal">(untuk countdown presisi)</span>
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

        {/* Plan Type Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Jenis Rencana
          </h2>
          <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlanType("death")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  planType === "death"
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <p className="font-semibold">Death Plan</p>
                <p className="text-xs opacity-70 mt-1">
                  Hitung mundur ke akhir hayat
                </p>
              </button>
              <button
                type="button"
                onClick={() => setPlanType("retirement")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  planType === "retirement"
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <p className="font-semibold">Retirement Plan</p>
                <p className="text-xs opacity-70 mt-1">
                  Hitung mundur ke pensiun (58)
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Manajemen Data
          </h2>
          <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200 space-y-3">
            {/* Export */}
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors text-left"
            >
              <Download className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="font-medium text-zinc-900">Export Data</p>
                <p className="text-sm text-zinc-500">Download semua data sebagai JSON</p>
              </div>
            </button>

            {/* Import */}
            <label className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="font-medium text-zinc-900">Import Data</p>
                <p className="text-sm text-zinc-500">Pulihkan dari file backup</p>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zona Berbahaya
          </h2>
          <div className="glass-card rounded-2xl p-6 bg-red-50 border border-red-200">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-100 transition-colors text-left"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-red-700">Hapus Semua Data</p>
                <p className="text-sm text-red-600">
                  Menghapus semua data termasuk goals
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-colors"
        >
          Simpan Perubahan
        </button>

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-zinc-500">
          <p>Total goals: {userData.goals.length}</p>
          <p>
            Dibuat:{" "}
            {new Date(userData.createdAt).toLocaleDateString("id-ID", {
              dateStyle: "long",
            })}
          </p>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">
                Hapus Semua Data?
              </h3>
              <p className="text-zinc-600 mb-6">
                Tindakan ini tidak dapat dibatalkan. Semua data termasuk goals akan
                dihapus permanen.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 px-4 bg-zinc-100 text-zinc-700 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAllData}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
