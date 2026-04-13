'use client'

import { ErrorView } from '@/features/error/ui/ErrorView'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return <ErrorView variant="runtime" onRetry={reset} />
}
