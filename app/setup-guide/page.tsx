"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Key,
  Shield,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react";

export default function SetupGuidePage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const redirectUri = "http://localhost:3000/api/auth/callback";
  const gmailScope = "https://www.googleapis.com/auth/gmail.readonly";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Key className="h-4 w-4 text-blue-600" />
            <span>Google Cloud OAuth Setup Guide</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200/80">
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span>Step-by-Step Walkthrough</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Connecting Your Live Gmail Account
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Google requires a free developer OAuth Client ID to connect directly with your Gmail inbox. Follow these 5 quick steps to set up your credentials.
          </p>
        </div>

        {/* Quick Reference Values */}
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            Copyable Configuration Values
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                Authorized Redirect URI:
              </span>
              <div className="flex items-center justify-between rounded-lg bg-white border border-blue-200 px-3 py-2 text-xs font-mono text-slate-800">
                <span>{redirectUri}</span>
                <button
                  onClick={() => copyToClipboard(redirectUri, "redirect")}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-sans font-medium ml-2"
                >
                  {copiedKey === "redirect" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                Requested Scope:
              </span>
              <div className="flex items-center justify-between rounded-lg bg-white border border-blue-200 px-3 py-2 text-xs font-mono text-slate-800">
                <span>{gmailScope}</span>
                <button
                  onClick={() => copyToClipboard(gmailScope, "scope")}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-sans font-medium ml-2"
                >
                  {copiedKey === "scope" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
                1
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Create a Google Cloud Project
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 pl-10 leading-relaxed">
              Navigate to the{" "}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold underline inline-flex items-center gap-1"
              >
                Google Cloud Console <ExternalLink className="h-3 w-3" />
              </a>{" "}
              and click <strong>&quot;Select a project&quot; &gt; &quot;New Project&quot;</strong>. Name it <em>&quot;Gmail Daily Digest&quot;</em> and click <strong>Create</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
                2
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Enable the Gmail API
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 pl-10 leading-relaxed">
              In the search bar at the top, type <strong>&quot;Gmail API&quot;</strong>, select it from the list of Marketplace APIs, and click <strong>Enable</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
                3
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Configure OAuth Consent Screen
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 pl-10 space-y-2 leading-relaxed">
              <p>
                From the left menu, select <strong>&quot;APIs &amp; Services&quot; &gt; &quot;OAuth consent screen&quot;</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Choose <strong>External</strong> user type and click Create.</li>
                <li>Enter App name: <code>Gmail Daily Digest</code> and your email for support.</li>
                <li>Under <strong>Scopes</strong>, click <strong>Add or Remove Scopes</strong>, and search for <code>.../auth/gmail.readonly</code>.</li>
                <li>Under <strong>Test users</strong>, add your personal Gmail address.</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
                4
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Create OAuth Client ID Credentials
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 pl-10 space-y-2 leading-relaxed">
              <p>
                Go to <strong>&quot;APIs &amp; Services&quot; &gt; &quot;Credentials&quot;</strong>. Click <strong>&quot;Create Credentials&quot; &gt; &quot;OAuth client ID&quot;</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Application type: <strong>Web application</strong>.</li>
                <li>Name: <code>Gmail Daily Digest Web Client</code>.</li>
                <li>
                  Under <strong>Authorized redirect URIs</strong>, click <strong>Add URI</strong> and paste:
                  <code className="block bg-slate-100 p-1.5 rounded mt-1 text-slate-800">
                    http://localhost:3000/api/auth/callback
                  </code>
                </li>
                <li>Click <strong>Create</strong> and copy your <strong>Client ID</strong> and <strong>Client Secret</strong>.</li>
              </ul>
            </div>
          </div>

          {/* Step 5 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
                5
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Add Keys to your .env File
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 pl-10 space-y-2 leading-relaxed">
              <p>
                Open your <code>.env</code> file in the project folder and paste the copied credentials:
              </p>
              <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto">
{`GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback`}
              </pre>
              <p className="text-slate-500 pt-1">
                Restart your dev server or reload the page. The app will immediately recognize the keys and allow 1-click live Gmail connection!
              </p>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="pt-4 flex justify-between items-center">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            &larr; Return to Dashboard
          </Link>

          <Link
            href="/privacy"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            Review Security & Data Retention &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
