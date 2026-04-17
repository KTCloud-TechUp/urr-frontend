"use client";

import { TrendingUp } from "lucide-react";
import { trendingSearchTerms } from "@/shared/lib/mocks/search";

interface TrendingSectionProps {
  onSelect: (term: string) => void;
}

export function TrendingSection({ onSelect }: TrendingSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
        <TrendingUp size={18} />
        인기 검색어
      </h2>
      <div className="flex flex-wrap gap-2">
        {trendingSearchTerms.map((term) => (
          <button
            key={term}
            onClick={() => onSelect(term)}
            className="rounded-full border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>
    </section>
  );
}
