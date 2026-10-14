"use client"

import { cn } from "@/lib/styles"

interface HtmlContentProps {
  readonly html: string | null | undefined
  readonly className?: string
}

export function HtmlContent({ html, className }: HtmlContentProps) {
  if (!html) {
    return null
  }

  return (
    <div
      className={cn("ck-content", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

HtmlContent.displayName = "HtmlContent"

export default HtmlContent
