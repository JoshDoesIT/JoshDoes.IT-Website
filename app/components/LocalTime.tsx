'use client'

import { useEffect, useState } from 'react'

export default function LocalTime() {
  const [timeString, setTimeString] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
      setTimeString(formatted)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-terminal-gray text-sm mb-2">
      Last login: {timeString || 'Loading...'} on ttys000
    </div>
  )
}

