"use client";

import { BookingProvider } from "@/features/booking/model/BookingContext";
import { LeftPanel } from "./LeftPanel";
import { RightMain } from "./RightMain";

interface BookingWidgetProps {
  eventId: string;
}

export function BookingWidget({ eventId }: BookingWidgetProps) {
  return (
    <BookingProvider eventId={eventId}>
      <div className="flex h-full">
        <LeftPanel />
        <RightMain />
      </div>
    </BookingProvider>
  );
}
