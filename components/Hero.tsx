import Image from "next/image";

export function Hero() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #20B2AA 0%, #17998F 60%, #0d7a72 100%)" }}
    >
      <Image
        src="/bg-header-desktop.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover hidden sm:block pointer-events-none select-none"
        fill
      />
      <Image
        src="/bg-header-mobile.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover block sm:hidden pointer-events-none select-none"
        fill
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
          Development Posts
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">
          Posts Directory
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
          Browse posts and filter by title, body, or author
        </p>
      </div>
    </div>
  );
}
