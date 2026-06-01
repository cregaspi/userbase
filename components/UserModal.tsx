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
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Close">
          <X size={15} />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="spinner" />
          </div>
        ) : user ? (
          <>
            {/* Header */}
            <div className="user-modal-header">
              <div className="user-modal-header__inner">
                <div
                  className="avatar avatar--lg"
                  style={{ backgroundColor: getAvatarColor(user.name) }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="user-modal-header__text">
                  <h2 className="user-modal-header__name">{user.name}</h2>
                  <p className="user-modal-header__username">
                    <AtSign size={12} strokeWidth={2} />
                    {user.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-body space-y-5">
              {/* Contact */}
              <section>
                <h3 className="section-label" style={{ marginBottom: "0.75rem" }}>Contact</h3>
                <div className="space-y-2.5">
                  <DetailRow icon={<Mail size={14} />} value={user.email} href={`mailto:${user.email}`} />
                  <DetailRow icon={<Phone size={14} />} value={user.phone} href={`tel:${user.phone}`} />
                  <DetailRow icon={<Globe size={14} />} value={user.website} href={user.website} external />
                </div>
              </section>

              {/* Address */}
              <section className="section-divider">
                <h3 className="section-label" style={{ marginBottom: "0.75rem" }}>Address</h3>
                <div className="address-block">
                  <MapPin size={14} className="address-block__icon" />
                  <div className="address-block__text">
                    <p>{user.address.street}, {user.address.suite}</p>
                    <p className="address-block__sub">{user.address.city}, {user.address.zipcode}</p>
                    <p className="address-block__geo">{user.address.geo.lat}, {user.address.geo.lng}</p>
                  </div>
                </div>
              </section>

              {/* Company */}
              <section className="section-divider">
                <h3 className="section-label" style={{ marginBottom: "0.75rem" }}>Company</h3>
                <div className="info-card">
                  <div className="flex items-center gap-2" style={{ marginBottom: "0.5rem" }}>
                    <Building2 size={14} style={{ color: "var(--primary)" }} />
                    <span className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{user.company.name}</span>
                  </div>
                  <p className="text-sm italic" style={{ color: "var(--ink)", marginBottom: "0.25rem" }}>
                    &quot;{user.company.catchPhrase}&quot;
                  </p>
                  <div className="icon-text" style={{ marginTop: "0.5rem" }}>
                    <Briefcase size={11} />
                    <span>{user.company.bs}</span>
                  </div>
                </div>
              </section>

              {/* Posts */}
              {posts.length > 0 && (
                <section className="section-divider">
                  <h3 className="section-label icon-text" style={{ marginBottom: "0.75rem" }}>
                    <FileText size={11} />
                    Posts ({posts.length})
                  </h3>
                  <div className="space-y-2">
                    {posts.map((post) => (
                      <div key={post.id} className="post-item">
                        <p className="post-item__title">{post.title}</p>
                        <p className="post-item__body">{post.body}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <Link href={`/users/${user.id}`} className="btn-primary">
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
    <div className="detail-row">
      <span className="detail-row__icon">{icon}</span>
      <span className={href ? "detail-row__link" : "detail-row__value"}>{value}</span>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </a>
    );
  }
  return content;
}
