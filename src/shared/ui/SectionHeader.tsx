import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  linkHref?: string;
  linkLabel?: string;
}

export function SectionHeader({ title, linkHref, linkLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">{title}</h2>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full pl-4 pr-3 py-1.5 flex items-center gap-1"
        >
          {linkLabel}
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
