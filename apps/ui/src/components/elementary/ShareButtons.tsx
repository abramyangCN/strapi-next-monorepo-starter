"use client"

import type { Data } from "@repo/strapi-types"
import { Facebook, Instagram, Link2, Linkedin } from "lucide-react"

import { RippleButton } from "@/components/ui/ripple-button"

type SocialPlatform = "facebook" | "instagram" | "linkedin"
type AnySocial = SocialPlatform | "wechat"

const shareUrlBuilders: Record<SocialPlatform, (url: string) => string | null> =
  {
    facebook: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    instagram: () => null, // no web share URL
  }

const iconMap: Record<
  SocialPlatform,
  React.ComponentType<{ className?: string }>
> = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
}

const titleMap: Record<SocialPlatform, string> = {
  facebook: "Share on Facebook",
  linkedin: "Share on LinkedIn",
  instagram: "Share on Instagram",
}

interface ShareButtonsProps {
  readonly socialMedias?: Data.Component<"elements.social-media">[]
}

export function ShareButtons({ socialMedias }: ShareButtonsProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  const btnClass =
    "h-9 w-9 rounded-full border-0 bg-transparent text-gray-600 hover:text-gray-900 cursor-pointer"

  return (
    <div className="flex items-center gap-2">
      <RippleButton
        className={btnClass}
        hoverClassName="bg-gray-200"
        rippleClassName="bg-gray-300"
        onClick={handleCopyLink}
        title="Copy link"
      >
        <Link2 className="h-4 w-4" />
      </RippleButton>

      {socialMedias?.map((social) => {
        const platform = social.social as AnySocial | undefined
        if (!platform || platform === "wechat") return null

        const Icon = iconMap[platform]
        const shareUrl = shareUrlBuilders[platform]?.(currentUrl)
        const href = shareUrl ?? social.link?.href

        if (!Icon || !href) return null

        return (
          <RippleButton
            key={social.id}
            className={btnClass}
            hoverClassName="bg-gray-200"
            rippleClassName="bg-gray-300"
            onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
            title={titleMap[platform]}
          >
            <Icon className="h-4 w-4" />
          </RippleButton>
        )
      })}
    </div>
  )
}
