import { BookingWidget } from "@/widgets/booking";
import { BookingGuard } from "@/widgets/booking/BookingGuard";
import { getEvents } from "@/features/event";

const FALLBACK_EVENT_IDS = Array.from({ length: 20 }, (_, i) => String(i + 1));

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

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function BookingPage({ params }: Props) {
  const { eventId } = await params;
  return (
    <BookingGuard eventId={eventId}>
      <BookingWidget eventId={eventId} />
    </BookingGuard>
  );
}
