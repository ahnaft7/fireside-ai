'use client'

import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
// import InterviewSession from '@/components/InterviewSession'

export default function Interview() {
//   const { data: session, status } = useSession()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push('/api/auth/signin')
//     } else if (status === 'authenticated') {
//       setIsReady(true)
//     }
//   }, [status, router])

//   if (!isReady) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Mock Interview Session</h1>
      {/* <InterviewSession /> */}
    </div>
  )
}