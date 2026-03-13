import { Suspense } from 'react'
import { MembershipWidget } from '@/widgets/membership'

export default function MembershipPage() {
  return (
    <Suspense>
      <MembershipWidget />
    </Suspense>
  )
}
