import { Suspense } from 'react'
import { MyPageWidget } from '@/widgets/my-page'
import { MyPageSkeleton } from '@/widgets/my-page/MyPageSkeleton'

export default function MyPage() {
  return (
    <Suspense fallback={<MyPageSkeleton />}>
      <MyPageWidget />
    </Suspense>
  )
}
