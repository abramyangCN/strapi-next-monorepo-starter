import type { Data } from "@repo/strapi-types"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import {
  StrapiSectionDescription,
  StrapiSectionTitle,
} from "@/components/page-builder/components/utilities/StrapiSectionHeader"
import { HtmlContent } from "@/components/ui/html-content"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { StrapiImageMedia } from "@/types/api"

interface FeatureCardProps {
  readonly card: Data.Component<"utilities.feature-card">
}

function FeatureCard({ card }: FeatureCardProps) {
  return (
    <div className="border-primary-700 flex h-full flex-col gap-3 border bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:gap-4 sm:p-6 md:p-8">
      <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
        {card.title}
      </h3>
      {card.description && (
        <HtmlContent
          html={card.description}
          className="prose prose-xs max-w-none text-xs text-gray-600 lg:text-base"
        />
      )}
    </div>
  )
}

export function StrapiFeatureCards({
  component,
}: {
  readonly component: Data.Component<"sections.feature-cards">
}) {
  if (!component.cards || component.cards.length === 0) {
    return null
  }

  const backgroundImageUrl = component.backgroundImage
    ? formatStrapiMediaUrl((component.backgroundImage as StrapiImageMedia)?.url)
    : null

  // Map column count to grid classes with mobile-first approach
  const gridColsClass = {
    "2": "sm:grid-cols-2",
    "3": "sm:grid-cols-2 lg:grid-cols-3",
    "4": "sm:grid-cols-2 lg:grid-cols-4",
  }[component.columnCount || "3"]

  return (
    <Section
      className={cn(
        "relative mt-8 mb-16 sm:mt-12 sm:mb-24 md:mt-16 md:mb-36",
        component.enableBgColor && component.bgColor ? "" : undefined
      )}
      style={{
        backgroundColor:
          component.enableBgColor && component.bgColor
            ? component.bgColor
            : undefined,
      }}
    >
      {/* Decorative Background Image - positioned at top right */}
      {backgroundImageUrl && (
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            className="object-cover object-center"
            priority={false}
            sizes="100vw"
          />
        </div>
      )}

      <Container className="relative z-10">
        {/* Section Header */}
        {(component.title || component.description) && (
          <div className="mb-6 flex flex-col items-center text-center sm:mb-8 md:mb-12">
            <StrapiSectionTitle title={component.title} />
            <StrapiSectionDescription description={component.description} />
          </div>
        )}

        {/* Cards Grid */}
        <div
          className={cn(
            "grid translate-y-12 gap-4 sm:translate-y-20 sm:gap-6 md:translate-y-28 lg:translate-y-36",
            gridColsClass
          )}
        >
          {component.cards.map((card, index) => (
            <FeatureCard key={card.id || index} card={card} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

StrapiFeatureCards.displayName = "StrapiFeatureCards"

export default StrapiFeatureCards
