import { EventDetailWidget } from "@/widgets/event-detail";
import { getEvents } from "@/features/event";

const FALLBACK_EVENT_IDS = Array.from({ length: 20 }, (_, i) => String(201 + i));

export async function generateStaticParams() {
  try {
    const events = await getEvents();
    if (events.length > 0) {
      return events.map((e) => ({ eventId: String(e.eventId) }));
    }
  } catch {
    // API not available at build time — use fallback
  }
  return FALLBACK_EVENT_IDS.map((id) => ({ eventId: id }));
}

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  return <EventDetailWidget eventId={eventId} />;
}
