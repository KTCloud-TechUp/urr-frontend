import { EventDetailWidget } from "@/widgets/event-detail";
import { allEventsCombined } from "@/shared/lib/mocks/events-page";

export function generateStaticParams() {
  return [
    { eventId: "evt-gdragon-2026" },
    ...allEventsCombined.map((event) => ({ eventId: event.id })),
  ];
}

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  return <EventDetailWidget eventId={eventId} />;
}
