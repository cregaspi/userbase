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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Close">
          <X size={15} />
        </button>

        {/* Post content */}
        <div className="modal-header">
          <h2 className="modal-title">{post.title}</h2>
          <p className="modal-body-text">{post.body}</p>
        </div>

        {/* Dates */}
        <div className="modal-dates">
          <div className="modal-date-item">
            <div className="icon-box icon-box--sm">
              <Calendar size={13} />
            </div>
            <div>
              <p className="modal-date-label">Created</p>
              <p className="modal-date-value">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <div className="modal-date-item">
              <div className="icon-box icon-box--sm">
                <RefreshCw size={13} />
              </div>
              <div>
                <p className="modal-date-label">Updated</p>
                <p className="modal-date-value">{formatDate(post.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Author */}
        {user && (
          <div className="author-section">
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>Author</p>
            <Link href={`/users/${user.id}`} className="author-link">
              <div className="avatar avatar--md" style={{ backgroundColor: avatarColor }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="author-link__name">{user.name}</p>
                <p className="author-link__meta">
                  <AtSign size={10} strokeWidth={2} />
                  {user.username}
                </p>
                {user.company && (
                  <p className="author-link__meta">
                    <Building2 size={10} strokeWidth={2} />
                    {user.company.name}
                  </p>
                )}
              </div>
              <ExternalLink size={14} className="author-link__icon" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
