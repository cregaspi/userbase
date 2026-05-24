import { UserDetail, Post } from "@/types/user";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Mail, Phone, Globe, MapPin, Building2,
  AtSign, Briefcase, FileText,
} from "lucide-react";

async function getUserDetail(id: string): Promise<UserDetail | null> {
  try {
    const res = await fetch(`https://apimocker.com/users/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getUserPosts(userId: string): Promise<Post[]> {
  try {
    const res = await fetch(`https://apimocker.com/posts/search?q=development`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const response = await res.json();
    const all: Post[] = Array.isArray(response) ? response : response.data || response.posts || [];
    return all.filter((p) => p.userId === Number(userId));
  } catch { return []; }
}

function getAvatarColor(name: string): string {
  const colors = ["#20B2AA","#E05D5D","#D97706","#7C3AED","#2563EB","#059669","#DC2626","#9333EA","#0891B2","#65A30D"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, posts] = await Promise.all([getUserDetail(id), getUserPosts(id)]);

  if (!user) notFound();

  const avatarColor = getAvatarColor(user.name);
  const initials = getInitials(user.name);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors duration-100" style={{ color: "var(--ink-muted)" }}>
        <ArrowLeft size={14} />
        Back to directory
      </Link>

      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: "var(--canvas)", borderColor: "var(--border)", boxShadow: "var(--shadow-elevated)" }}>
        {/* Hero strip */}
        <div className="h-16 relative" />

        {/* Avatar + name */}
        <div className="px-6 pb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 -mt-10 mb-4"
            style={{ backgroundColor: avatarColor, borderColor: "var(--canvas)" }}>
            {initials}
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink)" }}>{user.name}</h1>
          <p className="flex items-center gap-1.5 mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
            <AtSign size={13} strokeWidth={2} />{user.username}
          </p>
        </div>

        <div className="px-6 pb-6 space-y-6" style={{ borderTop: "1px solid var(--border)" }}>
          {/* Contact */}
          <section className="pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--ink-muted)" }}>Contact</h2>
            <div className="space-y-3">
              <InfoRow icon={<Mail size={15} />} label="Email" href={`mailto:${user.email}`} value={user.email} />
              <InfoRow icon={<Phone size={15} />} label="Phone" href={`tel:${user.phone}`} value={user.phone} />
              <InfoRow icon={<Globe size={15} />} label="Website" href={`${user.website}`} value={user.website} external />
            </div>
          </section>

          {/* Address */}
          <section style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--ink-muted)" }}>Address</h2>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--source-card)" }}>
                <MapPin size={15} style={{ color: "var(--primary)" }} />
              </div>
              <div style={{ color: "var(--ink)" }}>
                <p className="font-medium">{user.address.street}, {user.address.suite}</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--ink-muted)" }}>{user.address.city}, {user.address.zipcode}</p>
                <p className="text-xs mt-1 font-mono" style={{ color: "var(--ink-muted)" }}>{user.address.geo.lat}, {user.address.geo.lng}</p>
              </div>
            </div>
          </section>

          {/* Company */}
          <section style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--ink-muted)" }}>Company</h2>
            <div className="rounded-md p-4" style={{ backgroundColor: "var(--source-card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={16} style={{ color: "var(--primary)" }} />
                <span className="font-semibold" style={{ color: "var(--ink)" }}>{user.company.name}</span>
              </div>
              <p className="text-sm italic mb-3" style={{ color: "var(--ink)" }}>&quot;{user.company.catchPhrase}&quot;</p>
              <div className="flex items-center gap-2">
                <Briefcase size={12} style={{ color: "var(--ink-muted)" }} />
                <span className="text-xs capitalize" style={{ color: "var(--ink-muted)" }}>{user.company.bs}</span>
              </div>
            </div>
          </section>

          {/* Posts */}
          {posts.length > 0 && (
            <section style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-1.5" style={{ color: "var(--ink-muted)" }}>
                <FileText size={11} />
                Posts ({posts.length})
              </h2>
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-md p-4" style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}>
                    <p className="text-sm font-semibold capitalize leading-snug mb-2" style={{ color: "var(--ink)" }}>{post.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>{post.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode; label: string; value: string; href?: string; external?: boolean;
}

function InfoRow({ icon, label, value, href, external }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--source-card)" }}>
        <span style={{ color: "var(--primary)" }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs mb-0.5" style={{ color: "var(--ink-muted)" }}>{label}</p>
        {href ? (
          <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
            className="text-sm font-medium hover:underline truncate block" style={{ color: "var(--primary)" }}>
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>{value}</p>
        )}
      </div>
    </div>
  );
}
