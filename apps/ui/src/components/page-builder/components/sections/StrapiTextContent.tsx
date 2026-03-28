import type { Data } from "@repo/strapi-types"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import { HtmlContent } from "@/components/ui/html-content"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { StrapiImageMedia } from "@/types/api"

export function StrapiTextContent({
  component,
}: {
  readonly component: Data.Component<"sections.text-content">
}) {
  const backgroundImageUrl = component.backgroundImage
    ? formatStrapiMediaUrl((component.backgroundImage as StrapiImageMedia)?.url)
    : null

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
        <div className="mx-auto max-w-4xl">
          {component.title && (
            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
              {component.title}
            </h2>
          )}
          {component.content && (
            <HtmlContent
              html={component.content}
              className="prose prose-lg max-w-none"
            />
          )}
        </div>
      </Container>
    </Section>
  )
}

StrapiTextContent.displayName = "StrapiTextContent"

export default StrapiTextContent
