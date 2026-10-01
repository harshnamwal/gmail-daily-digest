"use client";

import React, { useState } from "react";
import {
  Mail,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectGoogle: () => void;
  onEnableDemo: () => void;
  googleConfigured: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onConnectGoogle,
  onEnableDemo,
  googleConfigured,
}) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Step indicator */}
        <div className="flex h-1.5 w-full bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
                <Mail className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Welcome to Gmail Daily Digest
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Stop interrupting your day to check repetitive emails. Receive a single, curated executive briefing once a day with all your key updates.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-left border border-slate-200/60 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <span>What You Get Each Day:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Categorized emails
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Action items flagged
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Approaching deadlines
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> 1-click links to Gmail
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 shadow-sm transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Strictly Read-Only & Zero-Password
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Your privacy is paramount. We request only the minimum necessary permissions to scan incoming subjects and snippets.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-left border border-slate-200/60 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Official Google OAuth:</strong> You log in on Google&apos;s servers. We never see or store your Google password.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strict Read-Only:</strong> We cannot send, delete, or modify any emails.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Encrypted Tokens:</strong> Stored locally using AES-256-GCM encryption with 1-click revocation.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 rounded-xl border border-slate-200 bg-white py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 shadow-sm transition-all"
                >
                  <span>Next: Choose Mode</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/50">
                <Clock className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Ready to Experience Your Digest?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  You can connect your live Gmail account using Google OAuth, or try out the full interactive experience using safe local demo mode.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onConnectGoogle();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all"
                >
                  <Lock className="h-4 w-4" />
                  <span>Connect Live Gmail (Google OAuth)</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEnableDemo();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Try Interactive Demo Mode (Instant Preview)</span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Dismiss and browse
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
