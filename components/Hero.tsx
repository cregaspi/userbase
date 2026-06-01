import Image from "next/image";

export function Hero() {
  return (
    <div className="hero">
      <Image
        src="/bg-header-desktop.svg"
        alt=""
        aria-hidden="true"
        className="hero__bg hero__bg--desktop"
        fill
      />
      <Image
        src="/bg-header-mobile.svg"
        alt=""
        aria-hidden="true"
        className="hero__bg hero__bg--mobile"
        fill
      />

      <div className="hero__content">
        <p className="hero__eyebrow">Development Posts</p>
        <h1 className="hero__title">Posts Directory</h1>
        <p className="hero__subtitle">Browse posts and filter by title, body, or author</p>
      </div>
    </div>
  );
}
