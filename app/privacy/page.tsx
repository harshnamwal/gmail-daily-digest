import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Ban,
  FileText,
  Key,
  Trash2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Briefing Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Privacy & Security Guarantee</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/80">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>Zero-Knowledge & Minimum Read-Only Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Our Privacy & Security Architecture
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Gmail Daily Digest is engineered with strict privacy boundaries. We treat your inbox as your private sanctuary, ensuring you retain total transparency and complete control over your data.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Lock className="h-4 w-4" />
              <span>1. Zero Password Sharing</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never ask for, see, or store your Gmail password. Authentication happens strictly through Google&apos;s official OAuth 2.0 authorization server.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>2. Minimum Read-Only Scope</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We request only <code>https://www.googleapis.com/auth/gmail.readonly</code>. This makes sending, editing, archiving, or deleting emails mathematically impossible.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <Key className="h-4 w-4" />
              <span>3. Military-Grade AES-256-GCM</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              All stored OAuth refresh tokens are encrypted at rest using AES-256-GCM with authenticated tags to prevent tampering and unauthorized access.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <Ban className="h-4 w-4" />
              <span>4. Zero Advertising or Selling</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your email snippets and summary data are never used for targeted ads, data brokerage, or training public language models.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">What Data We Collect & Store</h2>
            <p>
              When you connect your Gmail account, we store:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>Account Profile:</strong> Your Google user ID, email address, and name to greet you.
              </li>
              <li>
                <strong>Encrypted OAuth Tokens:</strong> Encrypted using AES-256-GCM, used exclusively during scheduled runs to fetch messages from the past 24 hours.
              </li>
              <li>
                <strong>Summary Archive:</strong> Categorized email summaries, action items, and timestamps for your dashboard (retained for up to 30 days).
              </li>
              <li>
                <strong>Delivery Preferences:</strong> Your preferred briefing time (e.g., 08:00 AM), timezone, active/paused status, and enabled categories.
              </li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">How Retention and Cleanup Work</h2>
            <p>
              Daily digests older than 30 days are automatically purged from the local store. We only retain the minimum history needed to render your weekly dashboard archive.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Revocation & Permanent Data Erasure</h2>
            <p>
              You maintain full sovereignty over your account. You can exercise the following at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Pause Summaries:</strong> Toggle &quot;Pause&quot; in Settings to stop automated sweeps without disconnecting.
              </li>
              <li>
                <strong>Disconnect Gmail:</strong> Instantly revokes your token with Google and disconnects the application.
              </li>
              <li>
                <strong>Delete All Data (GDPR Compliant):</strong> Permanently erases your user record, encrypted credentials, and historical digests from storage.
              </li>
              <li>
                <strong>Google Account Permissions:</strong> You can independently revoke access at any time directly through{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 underline inline-flex items-center gap-0.5"
                >
                  Google Security & Permissions <ExternalLink className="h-3 w-3" />
                </a>.
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
