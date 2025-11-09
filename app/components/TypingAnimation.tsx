'use client'

import { useEffect, useState } from 'react'

interface TypingAnimationProps {
  text: string
  speed?: number
  eraseSpeed?: number
  pauseAfterTyping?: number
  pauseAfterErasing?: number
  className?: string
}

export default function TypingAnimation({ 
  text, 
  speed = 100, 
  eraseSpeed = 50,
  pauseAfterTyping = 4000,
  pauseAfterErasing = 500,
  className = '' 
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    if (isTyping) {
      // Typing phase
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex])
          setCurrentIndex(prev => prev + 1)
        }, speed)

        return () => clearTimeout(timeout)
      } else {
        // Finished typing, pause then start erasing
        const timeout = setTimeout(() => {
          setIsPaused(true)
          setTimeout(() => {
            setIsPaused(false)
            setIsTyping(false)
          }, pauseAfterTyping)
        }, 0)

        return () => clearTimeout(timeout)
      }
    } else {
      // Erasing phase
      if (currentIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev.slice(0, -1))
          setCurrentIndex(prev => prev - 1)
        }, eraseSpeed)

        return () => clearTimeout(timeout)
      } else {
        // Finished erasing, pause then start typing again
        const timeout = setTimeout(() => {
          setIsPaused(true)
          setTimeout(() => {
            setIsPaused(false)
            setIsTyping(true)
          }, pauseAfterErasing)
        }, 0)

        return () => clearTimeout(timeout)
      }
    }
  }, [currentIndex, text, speed, eraseSpeed, isTyping, isPaused, pauseAfterTyping, pauseAfterErasing])

  return <span className={className}>{displayedText}</span>
}

