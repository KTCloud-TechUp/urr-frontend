import { EventDetailWidget } from "@/widgets/event-detail";
import { allEventsData } from "@/shared/lib/mocks/events-page";

export function generateStaticParams() {
  return allEventsData.map((event) => ({ eventId: event.id }));
}

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  return <EventDetailWidget eventId={eventId} />;
}
