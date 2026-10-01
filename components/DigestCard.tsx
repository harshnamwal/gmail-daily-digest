"use client";

import React from "react";
import {
  ExternalLink,
  Clock,
  Calendar,
  AlertCircle,
  Tag,
  ArrowUpRight,
  Briefcase,
  User,
  CreditCard,
  Plane,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { EmailSummaryItem, EmailCategory } from "@/lib/types";

interface DigestCardProps {
  item: EmailSummaryItem;
}

const categoryIcons: Record<EmailCategory, any> = {
  work: Briefcase,
  personal: User,
  bills: CreditCard,
  travel: Plane,
  promotions: Tag,
  updates: ShieldAlert,
};

const categoryBadgeStyles: Record<EmailCategory, string> = {
  work: "bg-blue-50 text-blue-700 border-blue-200/80",
  personal: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  bills: "bg-rose-50 text-rose-700 border-rose-200/80",
  travel: "bg-purple-50 text-purple-700 border-purple-200/80",
  promotions: "bg-amber-50 text-amber-700 border-amber-200/80",
  updates: "bg-slate-100 text-slate-700 border-slate-200/80",
};

export const DigestCard: React.FC<DigestCardProps> = ({ item }) => {
  const CatIcon = categoryIcons[item.category] || Briefcase;

  const formatReceivedTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="group relative rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
      {/* Top Header: Sender & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
            {item.sender.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate block">
              {item.sender.name}
            </span>
            <span className="text-[11px] text-slate-400 truncate block">
              {item.sender.email}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Category Badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${
              categoryBadgeStyles[item.category]
            }`}
          >
            <CatIcon className="h-3 w-3" />
            <span className="capitalize">{item.category}</span>
          </span>

          <span className="text-[11px] text-slate-400">
            {formatReceivedTime(item.receivedAt)}
          </span>
        </div>
      </div>

      {/* Subject Line */}
      <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
        {item.subject}
      </h3>

      {/* Short Summary */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
        {item.summary}
      </p>

      {/* Action / Deadline / Appointment highlights */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {item.actionItem && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200/70">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Action:</strong> {item.actionItem}
            </span>
          </div>
        )}

        {item.deadlineDate && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-800 border border-rose-200/70">
            <Clock className="h-3.5 w-3.5 text-rose-600 shrink-0" />
            <span>
              <strong>Deadline:</strong> {item.deadlineDate}
            </span>
          </div>
        )}

        {item.appointmentDate && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-800 border border-indigo-200/70">
            <Calendar className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span>
              <strong>Scheduled:</strong> {item.appointmentDate}
            </span>
          </div>
        )}
      </div>

      {/* Footer Link to Gmail */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
          {item.snippet ? `Snippet: "${item.snippet.slice(0, 80)}..."` : ""}
        </span>

        <a
          href={item.gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline shrink-0"
        >
          <span>Open in Gmail</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};
