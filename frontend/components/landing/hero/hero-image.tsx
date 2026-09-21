import * as React from "react";

interface HeroImageProps {
  className?: string;
  imageRef?: React.RefObject<HTMLDivElement | null>;
}

export function HeroImage({ className, imageRef }: HeroImageProps) {
  return (
    <div
      ref={imageRef}
      className={`relative w-full rounded-[20px] overflow-hidden border border-[#DDD6C9] shadow-[0_12px_44px_rgba(0,0,0,0.06)] bg-[#EAE5DC] ${
        className || ""
      }`}
    >
      <img
        src="/images/visora-hero.png"
        alt="VISORA Hero Artwork"
        width={1816}
        height={866}
        className="w-full h-auto block rounded-[20px]"
      />
    </div>
  );
}
