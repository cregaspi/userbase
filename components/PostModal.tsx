"use client";

import { useEffect, useCallback } from "react";
import { PostWithUser } from "@/types/user";
import { X, Calendar, RefreshCw, AtSign, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PostModalProps {
  post: PostWithUser | null;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
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

export function PostModal({ post, onClose }: PostModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!post) return null;

  const user = post.user;
  const avatarColor = user ? getAvatarColor(user.name) : "#9CA3AF";
  const initials = user ? getInitials(user.name) : "?";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg"
        style={{
          backgroundColor: "var(--canvas)",
          boxShadow: "var(--shadow-elevated)",
          animation: "slideIn 300ms cubic-bezier(0.4,0,0.2,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-100"
          style={{ color: "var(--ink-muted)", backgroundColor: "var(--surface-1)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--surface-2)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--surface-1)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-muted)";
          }}
          aria-label="Close"
        >
          <X size={15} />
        </button>

        {/* Post content */}
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2
            className="text-xl font-bold leading-snug capitalize pr-8 mb-4"
            style={{ color: "var(--ink)" }}
          >
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            {post.body}
          </p>
        </div>

        {/* Dates */}
        <div
          className="px-6 py-4 flex flex-wrap gap-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--source-card)" }}
            >
              <Calendar size={13} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <p className="text-xs mb-0.5" style={{ color: "var(--ink-muted)" }}>Created</p>
              <p className="text-xs font-medium" style={{ color: "var(--ink)" }}>
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--source-card)" }}
              >
                <RefreshCw size={13} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: "var(--ink-muted)" }}>Updated</p>
                <p className="text-xs font-medium" style={{ color: "var(--ink)" }}>
                  {formatDate(post.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User info — clickable, goes to /users/[id] */}
        {user && (
          <div className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--ink-muted)" }}>
              Author
            </p>
            <Link
              href={`/users/${user.id}`}
              className="flex items-center gap-3 p-3 rounded-md transition-all duration-150 group/user"
              style={{
                backgroundColor: "var(--source-card)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--primary)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 0 3px rgba(32,178,170,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>

              {/* Name + username */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--ink)" }}>
                  {user.name}
                </p>
                <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--ink-muted)" }}>
                  <AtSign size={10} strokeWidth={2} />
                  {user.username}
                </p>
                {user.company && (
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--ink-muted)" }}>
                    <Building2 size={10} strokeWidth={2} />
                    {user.company.name}
                  </p>
                )}
              </div>

              {/* Arrow indicator */}
              <ExternalLink size={14} className="shrink-0" style={{ color: "var(--primary)" }} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
