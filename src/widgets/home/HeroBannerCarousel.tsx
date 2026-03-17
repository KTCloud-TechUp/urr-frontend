"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatDateFull } from "@/shared/lib/format";
import { BOOKING_STATUS_LABELS } from "@/entities/event";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import type { BannerEvent } from "@/entities/event";

interface HeroBannerCarouselProps {
  banners: BannerEvent[];
}

const statusStyles: Record<string, string> = {
  open: "bg-booking-open/10 text-booking-open",
  upcoming: "bg-booking-upcoming/10 text-booking-upcoming",
  soldout: "bg-muted text-muted-foreground",
  closed: "bg-muted text-muted-foreground opacity-70",
};

const dotStyles: Record<string, string> = {
  open: "bg-booking-open",
  upcoming: "bg-booking-upcoming",
  soldout: "bg-muted-foreground",
  closed: "bg-muted-foreground",
};

export function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || banners.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isHovered, banners.length]);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % banners.length) + banners.length) % banners.length);
    },
    [banners.length],
  );

  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  if (!banners.length) return null;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl h-[360px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 슬라이드 컨테이너 */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={`/events/${banner.id}`}
            className="relative w-full h-full shrink-0 block"
          >
            {banner.bannerImage ? (
              <Image
                src={banner.bannerImage}
                alt={banner.title}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: getArtistGradient(banner.artistId) }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* 콘텐츠 */}
            <div className="relative h-full flex flex-col justify-between p-8">
              {/* 상단: 예매 상태 뱃지 */}
              <div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                    statusStyles[banner.status] ?? "bg-muted text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      dotStyles[banner.status] ?? "bg-muted-foreground",
                    )}
                  />
                  {BOOKING_STATUS_LABELS[banner.status as keyof typeof BOOKING_STATUS_LABELS] ?? banner.status}
                </span>
              </div>

              {/* 하단: 이벤트 정보 */}
              <div className="space-y-2">
                <h2
                  className="text-3xl font-bold text-white leading-tight"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                >
                  {banner.title}
                </h2>
                <p className="text-lg text-white/80">{banner.artistName}</p>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDateFull(banner.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {banner.venue}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 왼쪽 화살표 */}
      {banners.length > 1 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            goPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm shadow-lg"
          aria-label="이전 배너"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* 오른쪽 화살표 */}
      {banners.length > 1 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            goNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm shadow-lg"
          aria-label="다음 배너"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* 도트 인디케이터 (하단 중앙) */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-sm">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                goTo(i);
              }}
              className={cn(
                "size-2 rounded-full transition-all cursor-pointer",
                i === current ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70",
              )}
              aria-label={`배너 ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
