"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  ShieldCheck,
  Settings,
  HelpCircle,
  Sparkles,
  LogOut,
  RefreshCw,
  Lock,
} from "lucide-react";
import { UserProfile } from "@/lib/types";

interface NavbarProps {
  user?: UserProfile | null;
  isDemoMode: boolean;
  googleConfigured: boolean;
  onOpenSettings: () => void;
  onConnectGoogle: () => void;
  onEnableDemo: () => void;
  onResetDemo: () => void;
  onDisconnect: () => void;
  isGenerating?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isDemoMode,
  googleConfigured,
  onOpenSettings,
  onConnectGoogle,
  onEnableDemo,
  onResetDemo,
  onDisconnect,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 tracking-tight text-base">
                  Gmail Daily Digest
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  Read-Only
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Calm executive briefings from your inbox
              </p>
            </div>
          </Link>

          {/* Mode Indicator */}
          {user && (
            <div className="ml-2 hidden md:block">
              {isDemoMode ? (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200/60">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>Interactive Demo Mode</span>
                  <button
                    onClick={onResetDemo}
                    title="Reset sample data"
                    className="ml-1 text-amber-600 hover:text-amber-900 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200/60">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Connected: {user.email}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/setup-guide"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Google Setup Guide</span>
          </Link>

          <Link
            href="/privacy"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">Privacy & Security</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
              >
                <Settings className="h-3.5 w-3.5 text-slate-500" />
                <span>Settings</span>
              </button>

              <button
                onClick={onDisconnect}
                title="Disconnect Account"
                className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onEnableDemo}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
              >
                Try Demo Mode
              </button>
              <button
                onClick={onConnectGoogle}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Connect Gmail</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
