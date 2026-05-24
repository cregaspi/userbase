"use client";

import { User } from "@/types/user";
import { Mail, AtSign, Building2 } from "lucide-react";

interface UserCardProps {
  user: User;
  onClick: (user: User) => void;
  onFilterByCompany: (company: string) => void;
  activeFilters: string[];
  index: number;
}

function getAvatarColor(name: string): string {
  const colors = [
    "#20B2AA", "#E05D5D", "#D97706", "#7C3AED",
    "#2563EB", "#059669", "#DC2626", "#9333EA",
    "#0891B2", "#65A30D",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserCard({ user, onClick, onFilterByCompany, activeFilters, index }: UserCardProps) {
  const avatarColor = getAvatarColor(user.name);
  const initials = getInitials(user.name);
  const isCompanyActive = activeFilters.includes(user.company.name);

  return (
    <div
      className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 rounded-lg border cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: "var(--canvas)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
        animationDelay: `${index * 40}ms`,
        animation: "slideUp 200ms cubic-bezier(0.4,0,0.2,1) both",
      }}
      onClick={() => onClick(user)}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--primary)";
        el.style.boxShadow = "0 4px 16px rgba(32,178,170,0.12)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--border)";
        el.style.boxShadow = "var(--shadow-card)";
      }}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-white font-semibold text-sm select-none"
        style={{ backgroundColor: avatarColor }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-semibold text-base leading-tight truncate transition-colors duration-100 px-3 py-1.5 rounded-full inline-block"
            style={{ color: "var(--ink)", backgroundColor: "var(--surface-2)" }}
          >
            {user.name}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--ink-muted)" }}>
          <span className="flex items-center gap-1 min-w-0">
            <AtSign size={11} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{user.username}</span>
          </span>
          <span className="flex items-center gap-1 min-w-0">
            <Mail size={11} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{user.email}</span>
          </span>
        </div>
      </div>

      {/* Company tag */}
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onFilterByCompany(user.company.name)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium transition-all duration-100"
          style={{
            backgroundColor: isCompanyActive ? "var(--primary)" : "var(--surface-1)",
            color: isCompanyActive ? "white" : "var(--ink-muted)",
            border: `1px solid ${isCompanyActive ? "var(--primary)" : "var(--border)"}`,
          }}
          onMouseEnter={(e) => {
            if (!isCompanyActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--source-card)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isCompanyActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--surface-1)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-muted)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            }
          }}
          title={`Filter by ${user.company.name}`}
        >
          <Building2 size={10} strokeWidth={2} />
          {user.company.name}
        </button>
      </div>
    </div>
  );
}
