"use client";

import { PostWithUser } from "@/types/user";
import { Calendar, RefreshCw, User as UserIcon } from "lucide-react";

interface PostCardProps {
  post: PostWithUser;
  onClick: (post: PostWithUser) => void;
  onUserNameClick: (userName: string) => void;
  onCompanyClick: (company: string) => void;
  index: number;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
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

export function PostCard({ post, onClick, onUserNameClick, onCompanyClick, index }: PostCardProps) {
  const user = post.user;
  const avatarColor = user ? getAvatarColor(user.name) : "#9CA3AF";
  const initials = user ? getInitials(user.name) : "?";

  return (
    <div
      className="group post-card p-4 sm:p-5 rounded-lg border cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: "var(--canvas)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
        "--animation-delay": `${index * 40}ms`,
      } as React.CSSProperties & { "--animation-delay": string }}
      onClick={() => onClick(post)}
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
      {/* Title */}
      <h3
        className="font-semibold text-base leading-snug mb-2 capitalize transition-colors duration-100"
        style={{ color: "var(--ink)" }}
      >
        {post.title}
      </h3>

      {/* Body preview */}
      <p
        className="text-sm leading-relaxed mb-4 line-clamp-2"
        style={{ color: "var(--ink-muted)" }}
      >
        {post.body}
      </p>

      {/* Footer: dates + user */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 pt-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {/* Dates */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--ink-muted)" }}>
            <Calendar size={11} strokeWidth={2} />
            {formatDate(post.createdAt)}
          </span>
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--ink-muted)" }}>
              <RefreshCw size={11} strokeWidth={2} />
              {formatDate(post.updatedAt)}
            </span>
          )}
        </div>

        {/* User */}
        {user ? (
          <div className="shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUserNameClick(user.name);
              }}
              className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-100 hover:opacity-80"
              style={{ color: "#20B2AA", backgroundColor: "#f0fdfc" }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                style={{ backgroundColor: avatarColor, fontSize: "9px" }}
              >
                {initials}
              </div>
              {user.name}
            </button>
            {user.company?.name && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompanyClick(user.company.name);
                }}
                className="text-xs px-2 py-1 rounded text-white transition-colors duration-100 hover:opacity-90"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {user.company.name}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <UserIcon size={12} style={{ color: "var(--ink-muted)" }} />
            <span className="text-xs" style={{ color: "var(--ink-muted)" }}>Unknown</span>
          </div>
        )}
      </div>
    </div>
  );
}
