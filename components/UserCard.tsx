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
    "#20B2AA","#E05D5D","#D97706","#7C3AED",
    "#2563EB","#059669","#DC2626","#9333EA",
    "#0891B2","#65A30D",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function UserCard({ user, onClick, onFilterByCompany, activeFilters, index }: UserCardProps) {
  const avatarColor = getAvatarColor(user.name);
  const initials = getInitials(user.name);
  const isCompanyActive = activeFilters.includes(user.company.name);

  return (
    <div
      className="user-card"
      style={{ "--animation-delay": `${index * 40}ms` } as React.CSSProperties}
      onClick={() => onClick(user)}
    >
      <div className="avatar avatar--lg" style={{ backgroundColor: avatarColor }}>
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div style={{ marginBottom: "0.25rem" }}>
          <span className="user-card__name">{user.name}</span>
        </div>
        <div className="user-card__meta">
          <span className="user-card__meta-item">
            <AtSign size={11} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{user.username}</span>
          </span>
          <span className="user-card__meta-item">
            <Mail size={11} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{user.email}</span>
          </span>
        </div>
      </div>

      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onFilterByCompany(user.company.name)}
          className={`user-card__company-btn ${isCompanyActive ? "user-card__company-btn--active" : ""}`}
          title={`Filter by ${user.company.name}`}
        >
          <Building2 size={10} strokeWidth={2} />
          {user.company.name}
        </button>
      </div>
    </div>
  );
}
