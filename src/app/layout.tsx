import "./globals.css";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { LayoutShell } from "@/widgets/layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <TooltipProvider>
          <LayoutShell>{children}</LayoutShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
