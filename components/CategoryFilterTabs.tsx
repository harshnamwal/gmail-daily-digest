"use client";

import React from "react";
import { Search } from "lucide-react";
import { EmailCategory } from "@/lib/types";

interface CategoryFilterTabsProps {
  selectedCategory: EmailCategory | "all";
  onSelectCategory: (cat: EmailCategory | "all") => void;
  categoryCounts: Record<EmailCategory, number>;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CategoryFilterTabs: React.FC<CategoryFilterTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
  searchQuery,
  onSearchChange,
}) => {
  const categories: { id: EmailCategory | "all"; label: string; icon: string }[] = [
    { id: "all", label: "All Emails", icon: "📬" },
    { id: "work", label: "Work", icon: "💼" },
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "bills", label: "Bills & Finance", icon: "💳" },
    { id: "travel", label: "Travel", icon: "✈️" },
    { id: "promotions", label: "Promotions", icon: "🏷️" },
    { id: "updates", label: "Updates", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const count = cat.id === "all" ? totalCount : categoryCounts[cat.id] || 0;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/70"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                  isActive ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-64 shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by keyword or sender..."
          className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
        />
      </div>
    </div>
  );
};
