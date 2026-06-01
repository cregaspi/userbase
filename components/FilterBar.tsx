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
    <div className="filter-bar">
      <div className="filter-bar__search-wrap">
        <Search size={15} className="filter-bar__search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, article name or content…"
          className="filter-bar__input"
        />
      </div>

      {hasFilters && (
        <div className="filter-bar__chips">
          {activeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => onRemoveFilter(filter)}
              className="filter-chip"
            >
              {filter}
              <X size={11} strokeWidth={2.5} />
            </button>
          ))}
          <button onClick={onClearAll} className="filter-clear-btn">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
