"use client"

import { Facebook, Link2, Linkedin } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ShareButtons() {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={handleCopyLink}
        title="Copy link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full"
        asChild
      >
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full"
        asChild
      >
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}
