"use client";

import { Mic2 } from "lucide-react";
import type { Artist } from "@/shared/types";
import type { ArtistExtendedInfo } from "@/shared/lib/mocks/artist-page";

interface ArtistInfoSectionProps {
  artist: Artist;
  extendedInfo?: ArtistExtendedInfo;
}

export function ArtistInfoSection({ artist, extendedInfo }: ArtistInfoSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Mic2 size={20} className="text-muted-foreground" />
        아티스트 소개
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{artist.bio}</p>
      {extendedInfo && (
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-xs text-muted-foreground">데뷔</span>
            <p className="font-medium mt-0.5">{extendedInfo.debutDate}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <span className="text-xs text-muted-foreground">소속사</span>
            <p className="font-medium mt-0.5">{extendedInfo.agency}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <span className="text-xs text-muted-foreground">장르</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {extendedInfo.genres.map((genre) => (
                <span
                  key={genre}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
