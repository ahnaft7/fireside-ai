'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const InterviewInterface = dynamic(() => import('@/app/components/InterviewInterface'), {
  ssr: false,
})

const Interview = () => {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  if (!isReady) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Mock Interview Session</h1>
      <InterviewInterface />
    </div>
  )
}

export default Interview