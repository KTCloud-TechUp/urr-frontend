"use client";

import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import type { BannerEvent } from "@/entities/event";

interface HeroBannerCarouselProps {
  banners: BannerEvent[];
}

function formatBannerDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
}

export function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 4000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0",
          )}
        >
          {b.bannerImage ? (
            <img
              src={b.bannerImage}
              alt={b.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  b.gradient ?? "linear-gradient(135deg, #FF5E32, #1F2792)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        </div>
      ))}

      {/* 텍스트 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10 pointer-events-none">
        <p className="text-white/70 text-sm font-medium mb-1">
          {banner.artistName}
        </p>
        <h1 className="text-white text-2xl font-bold leading-tight">
          {banner.title}
        </h1>
        <p className="text-white/80 text-sm mt-1">
          {banner.venue} · {formatBannerDate(banner.date)}
        </p>
      </div>

      {/* 도트 인디케이터 */}
      <div className="absolute bottom-5 right-6 z-10 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 rounded-full transition-all cursor-pointer",
              i === current
                ? "w-5 bg-white"
                : "w-1.5 bg-white/50 hover:bg-white/75",
            )}
          />
        ))}
      </div>
    </div>
  );
}
