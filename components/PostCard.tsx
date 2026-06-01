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
      className="post-card"
      style={{ "--animation-delay": `${index * 40}ms` } as React.CSSProperties}
      onClick={() => onClick(post)}
    >
      <h3 className="post-card__title">{post.title}</h3>
      <p className="post-card__body">{post.body}</p>

      <div className="post-card__footer">
        <div className="post-card__dates">
          <span className="post-card__date">
            <Calendar size={11} strokeWidth={2} />
            {formatDate(post.createdAt)}
          </span>
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <span className="post-card__date">
              <RefreshCw size={11} strokeWidth={2} />
              {formatDate(post.updatedAt)}
            </span>
          )}
        </div>

        {user ? (
          <div className="shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onUserNameClick(user.name); }}
              className="post-card__author-btn"
            >
              <div
                className="avatar avatar--sm"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>
              {user.name}
            </button>
            {user.company?.name && (
              <button
                onClick={(e) => { e.stopPropagation(); onCompanyClick(user.company.name); }}
                className="post-card__company-btn"
              >
                {user.company.name}
              </button>
            )}
          </div>
        ) : (
          <div className="post-card__unknown-author">
            <UserIcon size={12} />
            <span className="text-xs">Unknown</span>
          </div>
        )}
      </div>
    </div>
  );
}
