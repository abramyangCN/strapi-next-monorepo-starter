import type { Data } from "@repo/strapi-types"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { HtmlContent } from "@/components/ui/html-content"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { StrapiImageMedia } from "@/types/api"

export function StrapiHighlightWithList({
  component,
}: {
  readonly component: Data.Component<"sections.highlight-with-list">
}) {
  if (!component.highlightCard) {
    return null
  }

  const backgroundImageUrl = component.backgroundImage
    ? formatStrapiMediaUrl((component.backgroundImage as StrapiImageMedia)?.url)
    : null

  const { highlightCard, listItems, enableBgColor, bgColor } = component

  return (
    <Section
      className={cn(
        "relative mb-8 overflow-hidden md:mb-16",
        enableBgColor && bgColor ? "" : undefined
      )}
      style={{
        backgroundColor: enableBgColor && bgColor ? bgColor : undefined,
      }}
    >
      {/* Decorative Background Image - positioned at top right */}
      {backgroundImageUrl && (
        <div className="pointer-events-none absolute inset-0 pb-8 md:pb-16">
          <div className="relative flex h-full">
            <Image
              src={backgroundImageUrl}
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={false}
            />
          </div>
        </div>
      )}

      <Container className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left Side - Highlight Card */}
          <div className="order-1 w-full lg:order-none lg:col-span-4">
            <div
              className={cn(
                "flex h-full flex-col justify-between gap-4 px-6 py-8 shadow-xl sm:gap-6 sm:px-10 sm:py-12 md:translate-y-8 lg:translate-y-16 lg:rounded-none lg:px-14 lg:py-20",
                highlightCard.enableCardBgColor && highlightCard.cardBgColor
                  ? ""
                  : "bg-secondary-400"
              )}
              style={{
                backgroundColor:
                  highlightCard.enableCardBgColor && highlightCard.cardBgColor
                    ? highlightCard.cardBgColor
                    : undefined,
              }}
            >
              {/* Card Content */}
              <div className="flex flex-col gap-4 sm:gap-6">
                {highlightCard.title && (
                  <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    {highlightCard.title}
                  </h2>
                )}
                {highlightCard.description && (
                  <HtmlContent
                    html={highlightCard.description}
                    className="prose prose-invert prose-sm max-w-none text-white/90"
                  />
                )}
              </div>

              {/* Button - touch-friendly size on mobile */}
              {highlightCard.button && (
                <div className="mt-4 sm:mt-auto">
                  <StrapiLink
                    component={highlightCard.button}
                    variant="primary"
                    className="inline-flex min-h-[44px] w-full items-center justify-center sm:w-auto"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Side - List Items */}
          <div className="order-2 flex flex-col gap-6 pt-4 sm:gap-8 sm:pt-0 lg:order-none lg:col-span-7 lg:col-start-6">
            {listItems?.map((item, index) => (
              <div
                key={item.id || index}
                className="flex flex-col gap-2 sm:gap-3"
              >
                <h3 className="text-lg font-semibold text-white sm:text-xl lg:text-2xl">
                  {item.title}
                </h3>
                {item.description && (
                  <HtmlContent
                    html={item.description}
                    className="prose prose-invert prose-sm max-w-none text-white/80"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

StrapiHighlightWithList.displayName = "StrapiHighlightWithList"

export default StrapiHighlightWithList
