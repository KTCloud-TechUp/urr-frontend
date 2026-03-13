"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ScrollableRowProps {
  children: React.ReactNode;
  className?: string;
  arrowYOffset?: string;
}

export function ScrollableRow({
  children,
  className,
  arrowYOffset,
}: ScrollableRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  useEffect(() => {
    const t = setTimeout(checkScroll, 50);
    return () => clearTimeout(t);
  }, [children, checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const arrowY = arrowYOffset ?? "top-1/2 -translate-y-1/2";

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div ref={scrollRef} className={cn("overflow-x-auto scrollbar-hide", className)}>
        {children}
      </div>
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none bg-gradient-to-l from-background via-background/60 to-transparent z-[1]" />
      )}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none bg-gradient-to-r from-background via-background/60 to-transparent z-[1]" />
      )}
      {isHovering && canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-2 size-10 rounded-full bg-background border border-border shadow-lg flex items-center justify-center hover:bg-accent transition-colors cursor-pointer z-10",
            arrowY,
          )}
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {isHovering && canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-2 size-10 rounded-full bg-background border border-border shadow-lg flex items-center justify-center hover:bg-accent transition-colors cursor-pointer z-10",
            arrowY,
          )}
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
