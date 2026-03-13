import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/shared/ui";
import { EventDetailHero } from "./EventDetailHero";
import { EventDetailTabs } from "./EventDetailTabs";
import { EventBookingSidebar } from "./EventBookingSidebar";
import { getEventDetailById } from "@/shared/lib/mocks/event-detail";

function EventDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-48" />
      <div className="flex gap-8 items-start">
        <div className="flex-1 space-y-6">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
        <div className="w-[400px] shrink-0">
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

interface EventDetailWidgetProps {
  eventId: string;
}

export function EventDetailWidget({ eventId }: EventDetailWidgetProps) {
  const event = getEventDetailById(eventId);

  if (!eventId) return <EventDetailSkeleton />;

  if (!event) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium">공연을 찾을 수 없습니다</p>
        <p className="text-sm text-muted-foreground">
          요청하신 공연 정보가 존재하지 않거나 삭제되었습니다.
        </p>
        <Link href="/events" className="text-sm text-primary hover:underline mt-2">
          공연 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        공연 목록으로 돌아가기
      </Link>

      {/* Two-panel layout */}
      <div className="flex gap-8">
        {/* Left: Info */}
        <div className="flex-1 min-w-0 space-y-8">
          <EventDetailHero event={event} />
          <EventDetailTabs event={event} />
        </div>

        {/* Right: Sticky sidebar */}
        <div className="w-[400px] shrink-0">
          <div className="sticky top-6">
            <EventBookingSidebar event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}
