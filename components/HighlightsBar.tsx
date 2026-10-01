"use client";

import React from "react";
import { AlertCircle, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { HighlightTag } from "@/lib/types";

interface HighlightsBarProps {
  counts: Record<HighlightTag, number>;
  selectedHighlight: HighlightTag | null;
  onSelectHighlight: (h: HighlightTag | null) => void;
}

export const HighlightsBar: React.FC<HighlightsBarProps> = ({
  counts,
  selectedHighlight,
  onSelectHighlight,
}) => {
  const cards = [
    {
      id: "reply_needed" as HighlightTag,
      label: "Action / Reply Needed",
      count: counts.reply_needed || 0,
      icon: AlertCircle,
      textColor: "text-amber-700",
      bgColor: "bg-amber-50/80",
      borderColor: "border-amber-200/80",
      activeRing: "ring-2 ring-amber-500",
      description: "Messages with questions, requests, or approvals waiting on you",
    },
    {
      id: "deadline" as HighlightTag,
      label: "Approaching Deadlines",
      count: counts.deadline || 0,
      icon: Clock,
      textColor: "text-rose-700",
      bgColor: "bg-rose-50/80",
      borderColor: "border-rose-200/80",
      activeRing: "ring-2 ring-rose-500",
      description: "Bills, submissions, or time-sensitive commitments",
    },
    {
      id: "appointment" as HighlightTag,
      label: "Meetings & Bookings",
      count: counts.appointment || 0,
      icon: Calendar,
      textColor: "text-indigo-700",
      bgColor: "bg-indigo-50/80",
      borderColor: "border-indigo-200/80",
      activeRing: "ring-2 ring-indigo-500",
      description: "Calendar invitations, flights, and scheduled events",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedHighlight === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectHighlight(isSelected ? null : card.id)}
            className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
              card.bgColor
            } ${card.borderColor} ${
              isSelected ? card.activeRing + " shadow-sm" : "hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${card.textColor}`} />
                <span className={`text-xs font-bold tracking-tight ${card.textColor}`}>
                  {card.label}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  card.count > 0
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-400 bg-white/40"
                }`}
              >
                {card.count}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
              {card.description}
            </p>
            {isSelected && (
              <span className="text-[10px] font-semibold text-slate-700 mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Filter applied (Click to clear)
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
