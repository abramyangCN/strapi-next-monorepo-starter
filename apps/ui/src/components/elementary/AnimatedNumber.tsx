"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number // 动画持续时间（秒）
  className?: string
  decimals?: number // 小数位数
}

export function AnimatedNumber({
  value,
  duration = 2,
  className = "",
  decimals = 0,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = ref.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const updateNumber = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (duration * 1000), 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = easeOutQuart * value

      setDisplayValue(currentValue)

      if (now < endTime) {
        requestAnimationFrame(updateNumber)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(updateNumber)
  }, [isVisible, value, duration])

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  return (
    <span ref={ref} className={className}>
      {formatNumber(displayValue)}
    </span>
  )
}
