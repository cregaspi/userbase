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
    const res = await fetch("https://apimocker.com/posts/search?q=development", { next: { revalidate: 60 } });
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
    <div className="user-detail-container">
      <Link href="/" className="back-link">
        <ArrowLeft size={14} />
        Back to directory
      </Link>

      <div className="detail-card">
        {/* Hero strip */}
        <div
          className="detail-card__hero-strip"
          style={{ background: `linear-gradient(135deg, ${avatarColor}cc, ${avatarColor}88)` }}
        />

        {/* Avatar + name */}
        <div className="detail-card__profile">
          <div
            className="detail-card__avatar-wrap"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <h1 className="detail-card__name">{user.name}</h1>
          <p className="detail-card__username">
            <AtSign size={13} strokeWidth={2} />
            {user.username}
          </p>
        </div>

        <div className="detail-card__sections space-y-6">
          {/* Contact */}
          <section className="detail-section">
            <h2 className="section-label" style={{ marginBottom: "1rem" }}>Contact</h2>
            <div className="space-y-3">
              <InfoRow icon={<Mail size={15} />} label="Email"   href={`mailto:${user.email}`}   value={user.email} />
              <InfoRow icon={<Phone size={15} />} label="Phone"  href={`tel:${user.phone}`}       value={user.phone} />
              <InfoRow icon={<Globe size={15} />} label="Website" href={user.website}             value={user.website} external />
            </div>
          </section>

          {/* Address */}
          <section className="section-divider--lg">
            <h2 className="section-label" style={{ marginBottom: "1rem" }}>Address</h2>
            <div className="flex items-start gap-3">
              <div className="icon-box icon-box--md" style={{ marginTop: "0.125rem" }}>
                <MapPin size={15} />
              </div>
              <div>
                <p className="font-medium" style={{ color: "var(--ink)" }}>
                  {user.address.street}, {user.address.suite}
                </p>
                <p className="address-block__sub">{user.address.city}, {user.address.zipcode}</p>
                <p className="address-block__geo">{user.address.geo.lat}, {user.address.geo.lng}</p>
              </div>
            </div>
          </section>

          {/* Company */}
          <section className="section-divider--lg">
            <h2 className="section-label" style={{ marginBottom: "1rem" }}>Company</h2>
            <div className="info-card">
              <div className="flex items-center gap-2" style={{ marginBottom: "0.75rem" }}>
                <Building2 size={16} style={{ color: "var(--primary)" }} />
                <span className="font-semibold" style={{ color: "var(--ink)" }}>{user.company.name}</span>
              </div>
              <p className="text-sm italic" style={{ color: "var(--ink)", marginBottom: "0.75rem" }}>
                &quot;{user.company.catchPhrase}&quot;
              </p>
              <div className="icon-text">
                <Briefcase size={12} />
                <span className="capitalize">{user.company.bs}</span>
              </div>
            </div>
          </section>

          {/* Posts */}
          {posts.length > 0 && (
            <section className="section-divider--lg">
              <h2 className="section-label icon-text" style={{ marginBottom: "1rem" }}>
                <FileText size={11} />
                Posts ({posts.length})
              </h2>
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="post-item post-item--lg">
                    <p className="post-item__title post-item__title--semibold">{post.title}</p>
                    <p className="post-item__body post-item__body--sm">{post.body}</p>
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
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

function InfoRow({ icon, label, value, href, external }: InfoRowProps) {
  return (
    <div className="info-row">
      <div className="icon-box icon-box--md">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="info-row__label">{label}</p>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="info-row__link"
          >
            {value}
          </a>
        ) : (
          <p className="info-row__value">{value}</p>
        )}
      </div>
    </div>
  );
}
