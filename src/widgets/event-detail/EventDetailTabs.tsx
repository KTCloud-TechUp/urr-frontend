"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { PerformanceInfoTab } from "./PerformanceInfoTab";
import { SalesInfoTab } from "./SalesInfoTab";
import type { EventDetail } from "@/shared/lib/mocks/event-detail";

type TabKey = "performance" | "sales";

const tabs: { key: TabKey; label: string }[] = [
  { key: "performance", label: "공연정보" },
  { key: "sales", label: "판매정보" },
];

interface EventDetailTabsProps {
  event: EventDetail;
}

export function EventDetailTabs({ event }: EventDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("performance");

  return (
    <div className="space-y-6">
      {/* Tab header */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-colors cursor-pointer relative",
              activeTab === tab.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {/* Active underline */}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "performance" ? (
        <PerformanceInfoTab event={event} />
      ) : (
        <SalesInfoTab event={event} />
      )}
    </div>
  );
}
