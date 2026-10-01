"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, Eye, Ban, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export const PermissionsExplainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-sm">
                Strict Minimal Permissions & Zero-Password Security
              </h3>
              <span className="rounded-md bg-emerald-100/60 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                gmail.readonly
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              We connect exclusively using Google&apos;s official OAuth 2.0 flow. We never see or store your Gmail password, and we request strictly <strong>read-only</strong> access to summarize recent emails.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>{isOpen ? "Hide Security Details" : "How Your Data is Protected"}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What we access */}
            <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-200/60">
              <div className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>What We Access & Why</span>
              </div>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Subject & Sender:</strong> To categorize messages (Work, Bills, Travel, Personal).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Message Snippet:</strong> To detect deadlines, meetings, and replies needed.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Message ID:</strong> To provide direct 1-click links to the original email in Gmail.</span>
                </li>
              </ul>
            </div>

            {/* What we never do */}
            <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-200/60">
              <div className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                <Ban className="h-4 w-4 text-rose-500" />
                <span>What We Never Do</span>
              </div>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>No Sending or Editing:</strong> Read-only scope makes sending, archiving, or deleting technically impossible.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>No Password Sharing:</strong> Sign in securely directly on Google.com.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>No Ads or Data Selling:</strong> Your emails are never used for advertising, training public models, or third-party tracking.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Retention & Revocation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl bg-blue-50/50 p-3.5 border border-blue-100 gap-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span>
                Tokens are stored with military-grade <strong>AES-256-GCM encryption</strong>. You can disconnect or purge all data in Settings anytime.
              </span>
            </div>
            <Link
              href="/privacy"
              className="text-blue-700 hover:text-blue-900 font-semibold underline underline-offset-2 shrink-0"
            >
              Read Full Privacy Policy &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
