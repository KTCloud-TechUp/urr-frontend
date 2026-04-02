export function ArtistMarquee() {
  const artists = [
    "IVE", "aespa", "BTS", "BLACKPINK", "NewJeans",
    "EXO", "NCT 127", "SEVENTEEN", "Stray Kids", "LE SSERAFIM",
    "TWICE", "Red Velvet", "SHINee", "BIGBANG", "2NE1",
  ];

  const doubled = [...artists, ...artists];

  return (
    <div
      className="py-8 relative"
      style={{
        background: "#0A0A1A",
        borderTop: "1px solid rgba(255,94,50,0.08)",
        borderBottom: "1px solid rgba(255,94,50,0.08)",
      }}
    >
      <p
        className="text-center mb-5"
        style={{
          fontSize: "0.62rem",
          color: "#94a3b8",
          fontWeight: 400,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        지금 가장 핫한 아티스트와 함께
      </p>

      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div
          className="flex gap-12 w-max items-center"
          style={{ animation: "landing-marquee 25s linear infinite" }}
        >
          {doubled.map((artist, i) => (
            <span
              key={i}
              className="text-[0.92rem] font-medium whitespace-nowrap transition-opacity duration-300 cursor-default"
              style={{ color: "#94a3b8", opacity: 0.7 }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "#e8edf3"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.color = "#94a3b8"; }}
            >
              {artist}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
