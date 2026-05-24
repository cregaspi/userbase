"use client";

import { Search, X } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilters: string[];
  onRemoveFilter: (filter: string) => void;
  onClearAll: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: FilterBarProps) {
  const hasFilters = activeFilters.length > 0;

  return (
    <div
      className="rounded-lg border p-3 sm:p-4"
      style={{
        backgroundColor: "var(--canvas)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Search input */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--ink-muted)" }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, article name or content…"
          className="w-full pl-9 pr-4 py-2 text-sm rounded-md border transition-colors duration-100"
          style={{
            backgroundColor: "var(--surface-1)",
            borderColor: "var(--border)",
            color: "var(--ink)",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--primary)";
            e.target.style.boxShadow = "0 0 0 3px rgba(32,178,170,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {activeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => onRemoveFilter(filter)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-medium transition-all duration-100"
              style={{
                backgroundColor: "var(--source-card)",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--primary)";
                (e.currentTarget as HTMLButtonElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--source-card)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
              }}
            >
              {filter}
              <X size={11} strokeWidth={2.5} />
            </button>
          ))}

          <button
            onClick={onClearAll}
            className="ml-auto text-xs transition-colors duration-100"
            style={{ color: "var(--ink-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-muted)";
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
