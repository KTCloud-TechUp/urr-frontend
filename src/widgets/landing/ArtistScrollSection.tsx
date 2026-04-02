"use client";

import { useRef } from "react";
import Image from "next/image";

const ARTISTS = [
  { name: "IVE", image: "/artists/artist_ive.png" },
  { name: "aespa", image: "/artists/artist_aespa.png" },
  { name: "BTS", image: "/artists/artist_bts.png" },
  { name: "BLACKPINK", image: "/artists/artist_blackpink.png" },
  { name: "NewJeans", image: "/artists/artist_newjeans.png" },
  { name: "SEVENTEEN", image: "/artists/artist_seventeen.png" },
  { name: "Stray Kids", image: "/artists/artist_stray-kids.png" },
  { name: "TXT", image: "/artists/artist_txt.png" },
  { name: "DAY6", image: "/artists/artist_day6.png" },
  { name: "G-Dragon", image: "/artists/artist_g-dragon.png" },
  { name: "(G)I-DLE", image: "/artists/artist_gi-dle.png" },
];

const DOUBLED = [...ARTISTS, ...ARTISTS];

export function ArtistScrollSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="relative py-[80px] overflow-hidden"
      style={{
        background: "#0D0D1F",
        borderTop: "1px solid rgba(255,94,50,0.08)",
        borderBottom: "1px solid rgba(255,94,50,0.08)",
      }}
    >
      {/* Section glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(31,39,146,0.06), transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-6 mb-10 landing-reveal">
        <div
          className="flex items-center gap-2.5 mb-3"
          style={{
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#FF7A56",
          }}
        >
          <span className="w-5 h-px" style={{ background: "#FF7A56" }} />
          Artists
        </div>
        <h2
          className="font-light mb-3"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            color: "#e8edf3",
            letterSpacing: "-0.03em",
            fontWeight: 200,
          }}
        >
          함께하는 아티스트들
        </h2>
        <p
          style={{
            fontSize: "0.88rem",
            color: "#94a3b8",
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: "480px",
          }}
        >
          K-POP을 사랑하는 찐팬이라면 누구나. URR에서 내가 좋아하는 아티스트의
          공연을 매크로 없이, 팬 신뢰 점수 기반으로 공정하게 만나세요.
        </p>
      </div>

      {/* Scrolling track */}
      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="flex gap-4"
          style={{
            width: "max-content",
            animation: "landing-marquee 40s linear infinite",
            paddingLeft: "24px",
            alignItems: "flex-end",
          }}
          onMouseEnter={() => {
            if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
          }}
          onMouseLeave={() => {
            if (trackRef.current) trackRef.current.style.animationPlayState = "running";
          }}
        >
          {DOUBLED.map((artist, i) => (
            <div
              key={i}
              className="relative shrink-0 rounded-2xl overflow-hidden group transition-all duration-300"
              style={{
                width: "200px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,94,50,0.10)",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,94,50,0.22)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,94,50,0.10)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              {/* Image container — square, contain */}
              <div className="relative mx-auto" style={{ width: "172px", height: "172px", margin: "16px auto 0" }}>
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>

              {/* Artist name */}
              <div
                className="text-center px-4 py-4"
                style={{
                  borderTop: "1px solid rgba(255,94,50,0.06)",
                  marginTop: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.84rem",
                    fontWeight: 500,
                    color: "#e8edf3",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {artist.name}
                </span>
              </div>

              {/* Hover top-edge glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(90deg, transparent, #FF7A56, transparent)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
