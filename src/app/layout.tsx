import "./globals.css";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { LayoutShell } from "@/widgets/layout";
import { NotificationProvider } from "@/features/notification";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <NotificationProvider>
          <TooltipProvider>
            <LayoutShell>{children}</LayoutShell>
          </TooltipProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
