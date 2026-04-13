import { TicketDetailWidget } from "@/widgets/ticket/TicketDetailWidget";

interface Props {
  params: Promise<{ reservationId: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  const { reservationId } = await params;
  return <TicketDetailWidget reservationId={reservationId} />;
}
