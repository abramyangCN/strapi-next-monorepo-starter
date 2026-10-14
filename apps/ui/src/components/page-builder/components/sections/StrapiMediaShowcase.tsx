import type { Data } from "@repo/strapi-types"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { StrapiImageMedia } from "@/types/api"

export function StrapiMediaShowcase({
  component,
}: {
  readonly component: Data.Component<"sections.media-showcase">
}) {
  const media = component.media as StrapiImageMedia
  const isVideo = media?.mime?.startsWith("video/")
  const mediaUrl = media ? formatStrapiMediaUrl(media.url) : null

  const backgroundImageUrl = component.backgroundImage
    ? formatStrapiMediaUrl((component.backgroundImage as StrapiImageMedia)?.url)
    : null

  if (!mediaUrl) {
    return null
  }

  return (
    <Section
      className={cn(
        "relative",
        component.enableBgColor && component.bgColor ? "" : undefined
      )}
      style={{
        backgroundColor:
          component.enableBgColor && component.bgColor
            ? component.bgColor
            : undefined,
      }}
    >
      {/* Background Image */}
      {backgroundImageUrl && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            className="object-cover"
            priority={false}
          />
        </div>
      )}

      <Container className="relative z-10">
        <div className="mx-auto">
          {/* Title */}
          {component.title && (
            <div
              className="prose prose-lg prose-headings:break-words prose-p:break-words mx-auto mb-8 max-w-none text-center"
              dangerouslySetInnerHTML={{ __html: component.title }}
            />
          )}

          {/* Media Content */}
          <div className="overflow-hidden bg-white">
            {isVideo ? (
              <video
                className="h-auto w-full"
                controls
                preload="metadata"
                poster={media.previewUrl || undefined}
              >
                <source src={mediaUrl} type={media.mime} />
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="relative aspect-video w-full">
                <Image
                  src={mediaUrl}
                  alt={media?.alternativeText || component.title || ""}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            )}
          </div>

          {/* Caption */}
          {component.caption && (
            <p className="mt-4 text-center text-sm text-gray-600 italic">
              {component.caption}
            </p>
          )}
        </div>
      </Container>
    </Section>
  )
}

StrapiMediaShowcase.displayName = "StrapiMediaShowcase"

export default StrapiMediaShowcase
