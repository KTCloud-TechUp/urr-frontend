import { TicketDetailWidget } from "@/widgets/ticket/TicketDetailWidget";

// Reservation IDs are runtime UUIDs — cannot be enumerated at build time.
// A placeholder entry satisfies Next.js static export requirement;
// real ticket URLs are handled by CloudFront SPA fallback (→ index.html).
export async function generateStaticParams() {
  return [{ reservationId: "placeholder" }];
}

interface Props {
  params: Promise<{ reservationId: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  const { reservationId } = await params;
  return <TicketDetailWidget reservationId={reservationId} />;
}
