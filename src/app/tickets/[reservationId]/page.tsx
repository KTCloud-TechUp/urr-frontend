import { TicketDetailWidget } from "@/widgets/ticket/TicketDetailWidget";

// Reservation IDs are runtime UUIDs — cannot be enumerated at build time.
// Returning [] satisfies the static export requirement; CloudFront SPA
// fallback handles runtime navigation to these paths.
export async function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ reservationId: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  const { reservationId } = await params;
  return <TicketDetailWidget reservationId={reservationId} />;
}
