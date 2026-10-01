"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Clock,
  History,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Inbox,
  Filter,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PermissionsExplainer } from "@/components/PermissionsExplainer";
import { ScheduleBanner } from "@/components/ScheduleBanner";
import { HighlightsBar } from "@/components/HighlightsBar";
import { CategoryFilterTabs } from "@/components/CategoryFilterTabs";
import { DigestCard } from "@/components/DigestCard";
import { EmptyState } from "@/components/EmptyState";
import { SettingsModal } from "@/components/SettingsModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import {
  UserProfile,
  DailyDigest,
  EmailCategory,
  HighlightTag,
  AppAuthStatus,
  UserPreferences,
} from "@/lib/types";
import { MOCK_EMAILS } from "@/lib/mock-data";
import Link from "next/link";

export default function Dashboard() {
  const [authStatus, setAuthStatus] = useState<AppAuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDigest, setCurrentDigest] = useState<DailyDigest | null>(null);
  const [digestHistory, setDigestHistory] = useState<DailyDigest[]>([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory | "all">("all");
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightTag | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(
    null
  );

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/auth/status");
      const data: AppAuthStatus = await res.json();
      setAuthStatus(data);
      if (data.latestDigest) {
        setCurrentDigest(data.latestDigest);
      }
    } catch (err) {
      console.error("Failed to load auth status:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/digest/history");
      const data = await res.json();
      if (data.history) {
        setDigestHistory(data.history);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Check if new user or just connected
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true") {
      setBannerMessage({
        type: "success",
        text: "Gmail connected successfully! Minimal read-only permissions are active.",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("error")) {
      setBannerMessage({
        type: "error",
        text: `Authentication error: ${params.get("error")}`,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnectGoogle = () => {
    if (!authStatus?.googleConfigured) {
      setBannerMessage({
        type: "info",
        text: "Google OAuth credentials not configured in .env. You can explore with Demo Mode or see the Setup Guide.",
      });
      return;
    }
    window.location.href = "/api/auth/google";
  };

  const handleEnableDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/demo/enable", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAuthStatus({
          authenticated: true,
          isDemoMode: true,
          googleConfigured: authStatus?.googleConfigured ?? false,
          user: data.user,
          latestDigest: data.digest,
        });
        setCurrentDigest(data.digest);
        setBannerMessage({
          type: "success",
          text: "Interactive Demo Mode activated. Explore full daily summaries with sample inbox data!",
        });
      }
    } catch (err) {
      console.error("Failed to enable demo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCurrentDigest(data.digest);
        setBannerMessage({
          type: "info",
          text: "Demo data has been reset to default state.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch("/api/auth/disconnect", { method: "POST" });
      setAuthStatus({
        authenticated: false,
        isDemoMode: false,
        googleConfigured: authStatus?.googleConfigured ?? false,
      });
      setCurrentDigest(null);
      setIsSettingsOpen(false);
      setBannerMessage({
        type: "info",
        text: "Account disconnected and tokens revoked.",
      });
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  const handleDeleteData = async () => {
    try {
      await fetch("/api/auth/delete-data", { method: "POST" });
      setAuthStatus({
        authenticated: false,
        isDemoMode: false,
        googleConfigured: authStatus?.googleConfigured ?? false,
      });
      setCurrentDigest(null);
      setIsSettingsOpen(false);
      setBannerMessage({
        type: "success",
        text: "All account records, tokens, and historical summaries permanently deleted.",
      });
    } catch (err) {
      console.error("Delete data error:", err);
    }
  };

  const handleSavePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrefs),
    });
    const data = await res.json();
    if (data.success && authStatus?.user) {
      setAuthStatus({
        ...authStatus,
        user: {
          ...authStatus.user,
          preferences: {
            ...authStatus.user.preferences,
            ...newPrefs,
          },
        },
      });
    }
  };

  const handleGenerateNow = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/digest/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success && data.digest) {
        setCurrentDigest(data.digest);
        setBannerMessage({
          type: "success",
          text: `Fresh summary created! ${data.digest.totalSummarized} new emails analyzed.`,
        });
      } else if (data.error) {
        setBannerMessage({
          type: "error",
          text: `Error: ${data.error}`,
        });
      }
    } catch (err: any) {
      setBannerMessage({
        type: "error",
        text: `Failed to generate summary: ${err.message}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulateEmpty = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/digest/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulateEmpty: true }),
      });
      const data = await res.json();
      if (data.success && data.digest) {
        setCurrentDigest(data.digest);
        setBannerMessage({
          type: "info",
          text: "Simulating empty state: 0 new emails since last briefing.",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter logic
  const filteredItems = (currentDigest?.items || []).filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    if (selectedHighlight && !item.highlights.includes(selectedHighlight)) {
      return false;
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchSender =
        item.sender.name.toLowerCase().includes(q) ||
        item.sender.email.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      if (!matchSubject && !matchSender && !matchSummary) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        user={authStatus?.user}
        isDemoMode={authStatus?.isDemoMode || false}
        googleConfigured={authStatus?.googleConfigured || false}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onConnectGoogle={handleConnectGoogle}
        onEnableDemo={handleEnableDemo}
        onResetDemo={handleResetDemo}
        onDisconnect={handleDisconnect}
        isGenerating={isGenerating}
      />

      {/* Alert Banner if present */}
      {bannerMessage && (
        <div
          className={`w-full py-2.5 px-4 text-xs font-medium text-center border-b flex items-center justify-center gap-2 ${
            bannerMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : bannerMessage.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          {bannerMessage.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          {bannerMessage.type === "error" && <AlertCircle className="h-4 w-4 text-rose-600" />}
          {bannerMessage.type === "info" && <Sparkles className="h-4 w-4 text-blue-600" />}
          <span>{bannerMessage.text}</span>
          <button
            onClick={() => setBannerMessage(null)}
            className="ml-3 text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm font-medium">Loading briefing environment...</p>
          </div>
        ) : !authStatus?.authenticated ? (
          /* =========================================================================
             Landing / Pre-Authentication View
             ========================================================================= */
          <div className="space-y-10 py-4">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200/60 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>One calm email summary every day</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Reclaim your mornings from <br className="hidden sm:inline" />
                inbox clutter.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Connect your Gmail with minimal read-only permissions. We summarize your new messages, group them into work, personal, bills, and travel, and surface urgent action items before you start your day.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleConnectGoogle}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
                >
                  <Lock className="h-4 w-4" />
                  <span>Connect with Google OAuth</span>
                </button>

                <button
                  onClick={handleEnableDemo}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Explore Demo Mode</span>
                </button>

                <Link
                  href="/setup-guide"
                  className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>OAuth Setup Instructions</span>
                </Link>
              </div>

              {!authStatus?.googleConfigured && (
                <div className="inline-block mt-2 rounded-xl bg-amber-50/80 px-4 py-2 border border-amber-200/70 text-xs text-amber-800 text-left">
                  <strong>Notice:</strong> Google OAuth credentials are not yet configured in <code>.env</code>. You can click <strong>Explore Demo Mode</strong> to immediately test all features with sample data, or follow the <Link href="/setup-guide" className="underline font-semibold">Setup Guide</Link> to connect live Gmail.
                </div>
              )}
            </div>

            {/* Transparent Permissions Explainer */}
            <PermissionsExplainer />

            {/* Interactive Preview of a Sample Summary */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Sample Daily Summary Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Here is what your daily briefing looks like with sample incoming messages
                  </p>
                </div>
                <button
                  onClick={handleEnableDemo}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Launch Interactive Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_EMAILS.slice(0, 4).map((email) => (
                  <DigestCard key={email.id} item={email} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             Authenticated Dashboard View (Live Gmail or Demo Mode)
             ========================================================================= */
          <div className="space-y-6">
            {/* Schedule & Delivery Header */}
            <ScheduleBanner
              preferences={authStatus.user!.preferences}
              lastDigestAt={currentDigest?.generatedAt || authStatus.user!.lastDigestAt}
              isPaused={authStatus.user!.preferences.isPaused}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onGenerateNow={handleGenerateNow}
              onSimulateEmpty={handleSimulateEmpty}
              isGenerating={isGenerating}
            />

            {/* Privacy & Permissions Card */}
            <PermissionsExplainer />

            {/* Highlights Bar */}
            {currentDigest && currentDigest.items.length > 0 && (
              <HighlightsBar
                counts={currentDigest.highlightCounts}
                selectedHighlight={selectedHighlight}
                onSelectHighlight={setSelectedHighlight}
              />
            )}

            {/* Filters & Content Section */}
            <div className="space-y-4">
              {currentDigest && (
                <CategoryFilterTabs
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  categoryCounts={currentDigest.categoryCounts}
                  totalCount={currentDigest.totalSummarized}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}

              {/* Items List or Empty State */}
              {filteredItems.length === 0 ? (
                <EmptyState
                  onRefresh={handleGenerateNow}
                  onLoadSamples={handleEnableDemo}
                  isGenerating={isGenerating}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <DigestCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Past Digest History Drawer Toggle */}
            <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showHistory) fetchHistory();
                }}
                className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900"
              >
                <History className="h-4 w-4 text-slate-400" />
                <span>{showHistory ? "Hide Past Briefings" : "View Past Briefings History"}</span>
              </button>

              <span>
                30-day automatic retention • Encrypted with AES-256-GCM
              </span>
            </div>

            {/* History Table / Accordion */}
            {showHistory && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Past Digests Archive
                </h4>
                {digestHistory.length === 0 ? (
                  <p className="text-xs text-slate-400">No past archives available yet.</p>
                ) : (
                  <div className="space-y-2">
                    {digestHistory.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => setCurrentDigest(d)}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="font-semibold text-slate-800">
                            {new Date(d.generatedAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            at{" "}
                            {new Date(d.generatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <span className="text-slate-500 font-medium">
                          {d.totalSummarized} emails summarized
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Gmail Daily Digest</span>
            <span>•</span>
            <span>Minimal Read-Only OAuth</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/setup-guide" className="hover:text-slate-800 transition-colors">
              Google OAuth Setup
            </Link>
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 transition-colors"
            >
              Google Account Permissions
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {authStatus?.user && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          preferences={authStatus.user.preferences}
          userEmail={authStatus.user.email}
          isDemoUser={authStatus.isDemoMode}
          onSavePreferences={handleSavePreferences}
          onDisconnect={handleDisconnect}
          onDeleteData={handleDeleteData}
        />
      )}

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onConnectGoogle={handleConnectGoogle}
        onEnableDemo={handleEnableDemo}
        googleConfigured={authStatus?.googleConfigured || false}
      />
    </div>
  );
}
