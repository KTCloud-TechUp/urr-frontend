import { Loader2 } from 'lucide-react'

export function PaymentProcessingOverlay() {
  return (
    <div className="fixed inset-0 z-40">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[320px] rounded-xl bg-white shadow-lg p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              결제 처리 중...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
