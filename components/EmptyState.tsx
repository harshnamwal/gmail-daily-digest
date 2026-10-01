"use client";

import React from "react";
import { CheckCircle2, RefreshCw, Sparkles, Inbox } from "lucide-react";

interface EmptyStateProps {
  onRefresh: () => void;
  onLoadSamples?: () => void;
  isGenerating?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onRefresh,
  onLoadSamples,
  isGenerating,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-12 text-center shadow-xs">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
        <Inbox className="h-8 w-8 text-emerald-600" />
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1.5">
        All caught up! Zero new emails
      </h3>

      <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
        No new emails have arrived since your last daily summary. Your inbox is quiet, with no urgent action items or pending replies.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin text-blue-400" : ""}`} />
          <span>{isGenerating ? "Checking Inbox..." : "Check For New Emails"}</span>
        </button>

        {onLoadSamples && (
          <button
            onClick={onLoadSamples}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Load Sample Emails</span>
          </button>
        )}
      </div>
    </div>
  );
};
