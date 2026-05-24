"use client";

import { useEffect, useCallback } from "react";
import { UserDetail, Post } from "@/types/user";
import {
  X, Mail, Phone, Globe, MapPin, Building2,
  AtSign, ExternalLink, Briefcase, FileText,
} from "lucide-react";
import Link from "next/link";

interface UserModalProps {
  user: UserDetail | null;
  posts: Post[];
  isLoading: boolean;
  onClose: () => void;
}

function getAvatarColor(name: string): string {
  const colors = [
    "#20B2AA","#E05D5D","#D97706","#7C3AED",
    "#2563EB","#059669","#DC2626","#9333EA",
    "#0891B2","#65A30D",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function UserModal({ user, posts, isLoading, onClose }: UserModalProps) {
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
        {/* Close */}
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

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
            />
          </div>
        ) : user ? (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-4 pr-8">
                <div
                  className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getAvatarColor(user.name) }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold leading-tight truncate" style={{ color: "var(--ink)" }}>
                    {user.name}
                  </h2>
                  <p className="text-sm flex items-center gap-1 mt-0.5" style={{ color: "var(--ink-muted)" }}>
                    <AtSign size={12} strokeWidth={2} />
                    {user.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Contact */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--ink-muted)" }}>
                  Contact
                </h3>
                <div className="space-y-2.5">
                  <DetailRow icon={<Mail size={14} />} value={user.email} href={`mailto:${user.email}`} />
                  <DetailRow icon={<Phone size={14} />} value={user.phone} href={`tel:${user.phone}`} />
                  <DetailRow icon={<Globe size={14} />} value={user.website} href={`${user.website}`} external />
                </div>
              </section>

              {/* Address */}
              <section style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--ink-muted)" }}>
                  Address
                </h3>
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
                  <div className="text-sm" style={{ color: "var(--ink)" }}>
                    <p>{user.address.street}, {user.address.suite}</p>
                    <p>{user.address.city}, {user.address.zipcode}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--ink-muted)" }}>
                      {user.address.geo.lat}, {user.address.geo.lng}
                    </p>
                  </div>
                </div>
              </section>

              {/* Company */}
              <section style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--ink-muted)" }}>
                  Company
                </h3>
                <div className="rounded-md p-4" style={{ backgroundColor: "var(--source-card)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={14} style={{ color: "var(--primary)" }} />
                    <span className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{user.company.name}</span>
                  </div>
                  <p className="text-sm italic mb-1" style={{ color: "var(--ink)" }}>&quot;{user.company.catchPhrase}&quot;</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Briefcase size={11} style={{ color: "var(--ink-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--ink-muted)" }}>{user.company.bs}</span>
                  </div>
                </div>
              </section>

              {/* Posts */}
              {posts.length > 0 && (
                <section style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: "var(--ink-muted)" }}>
                    <FileText size={11} />
                    Posts ({posts.length})
                  </h3>
                  <div className="space-y-2">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-md p-3"
                        style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}
                      >
                        <p className="text-sm font-medium capitalize leading-snug mb-1" style={{ color: "var(--ink)" }}>
                          {post.title}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                          {post.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex justify-end" style={{ borderTop: "1px solid var(--border)" }}>
              <Link
                href={`/users/${user.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-100"
                style={{ backgroundColor: "var(--primary)", color: "white" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--primary-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--primary)";
                }}
              >
                Open full page
                <ExternalLink size={13} strokeWidth={2} />
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  value: string;
  href?: string;
  external?: boolean;
}

function DetailRow({ icon, value, href, external }: DetailRowProps) {
  const content = (
    <div className="flex items-center gap-2.5">
      <span style={{ color: "var(--primary)" }}>{icon}</span>
      <span className="text-sm truncate" style={{ color: href ? "var(--primary)" : "var(--ink)" }}>
        {value}
      </span>
    </div>
  );
  if (href) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
        className="block hover:underline" onClick={(e) => e.stopPropagation()}>
        {content}
      </a>
    );
  }
  return content;
}
