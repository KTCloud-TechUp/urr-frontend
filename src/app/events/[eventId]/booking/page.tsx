import { BookingWidget } from "@/widgets/booking";
import { allEventsCombined } from "@/shared/lib/mocks/events-page";

export function generateStaticParams() {
  return allEventsCombined.map((e) => ({ eventId: e.id }));
}

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function BookingPage({ params }: Props) {
  const { eventId } = await params;
  return <BookingWidget eventId={eventId} />;
}
