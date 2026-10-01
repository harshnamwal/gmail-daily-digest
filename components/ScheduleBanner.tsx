"use client";

import React from "react";
import {
  Clock,
  Calendar,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { UserPreferences } from "@/lib/types";

interface ScheduleBannerProps {
  preferences: UserPreferences;
  lastDigestAt?: string;
  isPaused: boolean;
  onOpenSettings: () => void;
  onGenerateNow: () => void;
  onSimulateEmpty: () => void;
  isGenerating: boolean;
}

export const ScheduleBanner: React.FC<ScheduleBannerProps> = ({
  preferences,
  lastDigestAt,
  isPaused,
  onOpenSettings,
  onGenerateNow,
  onSimulateEmpty,
  isGenerating,
}) => {
  const formatTime12h = (time24: string) => {
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const deliveryDisplay = preferences.deliveryTime
    ? formatTime12h(preferences.deliveryTime)
    : "8:00 AM";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/60 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200/60">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              <span>Daily Delivery: {deliveryDisplay}</span>
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <span>Timezone: {preferences.timezone || "Local / UTC"}</span>
            </span>

            {isPaused ? (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200/60">
                <AlertCircle className="h-3 w-3 text-amber-600" />
                <span>Delivery Paused</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Active Daily Dispatch</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Your Inbox, distillated once a day
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Every morning at {deliveryDisplay}, we scan new emails since your last briefing, group them into categories, and flag items requiring your prompt attention.
          </p>

          {lastDigestAt && (
            <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
              <Calendar className="h-3 w-3" />
              <span>
                Last summary generated: {new Date(lastDigestAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })} at {new Date(lastDigestAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </p>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2.5 lg:self-center">
          <button
            onClick={onGenerateNow}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin text-blue-400" : ""}`} />
            <span>{isGenerating ? "Analyzing Inbox..." : "Generate Summary Now"}</span>
          </button>

          <a
            href="/api/digest/generate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            <span>Preview Email Format</span>
          </a>

          <button
            onClick={onSimulateEmpty}
            title="Test how the page looks when there are no new emails"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Inbox className="h-4 w-4 text-slate-400" />
            <span>Test Empty State</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
            title="Configure delivery time and filters"
          >
            <Sliders className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
