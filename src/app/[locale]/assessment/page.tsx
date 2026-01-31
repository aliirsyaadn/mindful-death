"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import {
  AssessmentProvider,
  useAssessment,
  QuestionRenderer,
  AssessmentProgress,
  AssessmentNavigation,
  SectionHeader,
  ResultsSummary,
} from "@/components/assessment";
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

function AssessmentContent() {
  const router = useRouter();
  const t = useTranslations();
  const { state, setAnswer, goNext, goBack, complete, answers } = useAssessment();
  const [showExitDialog, setShowExitDialog] = useState(false);

  // If we have a result, show the results summary
  if (state.result) {
    return <ResultsSummary />;
  }

  const handleNext = () => {
    if (state.isLastQuestion || state.isComplete) {
      complete();
    } else {
      goNext();
    }
  };

  const handleExit = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
              <AlertDialogTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-zinc-600" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("assessment.exitTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("assessment.exitDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("assessment.continueAssessment")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExit}>
                    {t("assessment.exit")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <h1 className="font-bold text-lg text-zinc-900">
              {t("assessment.title")}
            </h1>

            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <AssessmentProgress />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg pb-32">
        {/* Section header */}
        {state.currentSection && (
          <SectionHeader section={state.currentSection} />
        )}

        {/* Question */}
        {state.currentQuestion && (
          <QuestionRenderer
            question={state.currentQuestion}
            value={answers[state.currentQuestion.id]}
            onChange={(value) => setAnswer(state.currentQuestion!.id, value)}
          />
        )}
      </main>

      {/* Navigation */}
      <AssessmentNavigation
        onBack={goBack}
        onNext={handleNext}
        canGoBack={state.canGoBack}
        canGoNext={state.canGoNext}
        isLastQuestion={state.isLastQuestion}
        isComplete={state.isComplete}
      />
    </div>
  );
}

export default function AssessmentPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-100 to-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full mx-auto mb-4" />
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AssessmentProvider>
      <AssessmentContent />
    </AssessmentProvider>
  );
}
