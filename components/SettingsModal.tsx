"use client";

import React, { useState } from "react";
import {
  X,
  Clock,
  Globe,
  Bell,
  PauseCircle,
  PlayCircle,
  LogOut,
  Trash2,
  Check,
  AlertTriangle,
  Mail,
  Shield,
} from "lucide-react";
import { UserPreferences, EmailCategory } from "@/lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  userEmail: string;
  isDemoUser: boolean;
  onSavePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  onDisconnect: () => Promise<void>;
  onDeleteData: () => Promise<void>;
}

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const CATEGORIES: { id: EmailCategory; label: string; desc: string }[] = [
  { id: "work", label: "Work & Projects", desc: "Syncs, roadmaps, project agendas, client proposals" },
  { id: "personal", label: "Personal Correspondence", desc: "Friends, family, social dinners, personal catch-ups" },
  { id: "bills", label: "Bills & Finance", desc: "Bank alerts, credit card statements, invoices, receipts" },
  { id: "travel", label: "Travel & Itineraries", desc: "Flights, hotel bookings, boarding passes, rides" },
  { id: "promotions", label: "Promotions & Newsletters", desc: "Substack, discounts, product launches" },
  { id: "updates", label: "Security & System Updates", desc: "Security alerts, verification notices, logins" },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  userEmail,
  isDemoUser,
  onSavePreferences,
  onDisconnect,
  onDeleteData,
}) => {
  const [deliveryTime, setDeliveryTime] = useState(preferences.deliveryTime || "08:00");
  const [timezone, setTimezone] = useState(
    preferences.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );
  const [isPaused, setIsPaused] = useState(preferences.isPaused);
  const [categories, setCategories] = useState<EmailCategory[]>(
    preferences.categoriesEnabled || ["work", "personal", "bills", "travel", "promotions", "updates"]
  );
  const [sendEmailNotification, setSendEmailNotification] = useState(
    preferences.sendEmailNotification ?? true
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (cat: EmailCategory) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSavePreferences({
        deliveryTime,
        timezone,
        isPaused,
        categoriesEnabled: categories,
        sendEmailNotification,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteData();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Summary Preferences & Account</h2>
            <p className="text-xs text-slate-500">
              Manage your delivery schedule, categories, and privacy controls
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          {/* Section 1: Delivery Schedule */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-500" /> Delivery Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Daily Briefing Time
                </label>
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  {COMMON_TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pause/Resume Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200/60">
              <div className="flex items-center gap-3">
                {isPaused ? (
                  <PauseCircle className="h-5 w-5 text-amber-500" />
                ) : (
                  <PlayCircle className="h-5 w-5 text-emerald-600" />
                )}
                <div>
                  <span className="font-semibold text-slate-800 text-xs block">
                    {isPaused ? "Daily Summaries Paused" : "Daily Summaries Active"}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {isPaused
                      ? "Summaries are on hold. No daily emails or automated sweeps."
                      : "Receiving briefings every day at " + deliveryTime}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  isPaused
                    ? "bg-emerald-600 text-white border-transparent hover:bg-emerald-700"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
            </div>
          </div>

          {/* Section 2: Categories to Include */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories to Include in Daily Briefing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const isChecked = categories.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? "bg-blue-50/50 border-blue-200"
                        : "bg-slate-50/50 border-slate-200/60 opacity-60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight block">
                        {cat.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 3: Save button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {saveSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <span>{saving ? "Saving..." : "Save Preferences"}</span>
              )}
            </button>
          </div>

          {/* Section 4: Privacy, Disconnect & Delete Data */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-slate-500" /> Account & Data Controls
            </h3>

            <div className="space-y-2">
              {/* Disconnect Gmail */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">
                    Disconnect Gmail
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Revokes access token with Google and disconnects your inbox.
                  </span>
                </div>
                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>

              {/* Delete Account Data */}
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/30">
                {!showDeleteConfirm ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-rose-900 block">
                        Delete Account Data & History
                      </span>
                      <span className="text-[11px] text-rose-700 block">
                        Permanently deletes all encrypted tokens, settings, and past summaries.
                      </span>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-1 text-xs font-medium text-rose-700 hover:text-rose-900 px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      <span>Delete Data</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2 text-rose-800">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <p className="text-xs font-medium">
                        Are you sure? This will revoke OAuth tokens with Google and irreversibly erase your account profile, delivery schedule, and all past digests.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
                      >
                        {isDeleting ? "Erasing..." : "Yes, Permanently Erase Everything"}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
