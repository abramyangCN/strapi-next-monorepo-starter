"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/styles"

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  hoverClassName?: string
  rippleClassName?: string
}

export function RippleButton({
  children,
  className,
  hoverClassName = "bg-primary-500",
  rippleClassName = "bg-primary-100",
  ...props
}: RippleButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseDown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsActive(false)
    // 使用 requestAnimationFrame 确保状态重置后再设置为 true
    requestAnimationFrame(() => {
      setIsActive(true)
    })
  }

  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsActive(false)
    }, 800)
  }

  return (
    <button
      type="button"
      className={cn(
        "bg-primary-700 relative inline-flex items-center justify-center overflow-hidden border border-white text-white",
        className
      )}
      onMouseEnter={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
      onFocus={() => {
        setIsHovered(true)
      }}
      onBlur={() => {
        setIsHovered(false)
        handleMouseUp()
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseUp}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 z-0 transition-opacity duration-800",
          hoverClassName
        )}
        style={{ opacity: isHovered ? 0.5 : 0 }}
      />
      <span
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 z-0 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full",
          rippleClassName
        )}
        style={{
          transform: isActive ? "scale(3)" : "scale(0)",
          opacity: isActive ? 0 : 0.8,
          transition: isActive ? "all 800ms ease-out" : "none",
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  )
}
