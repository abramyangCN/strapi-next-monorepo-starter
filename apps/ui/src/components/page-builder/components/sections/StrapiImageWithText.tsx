import type { Data } from "@repo/strapi-types"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import { HtmlContent } from "@/components/ui/html-content"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { StrapiImageMedia } from "@/types/api"

export function StrapiImageWithText({
  component,
}: {
  readonly component: Data.Component<"sections.image-with-text">
}) {
  const isLeftLayout = component.layout === "left"
  const imageUrl = component.image
    ? formatStrapiMediaUrl((component.image as StrapiImageMedia)?.url)
    : null

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
        <div
          className={cn(
            "flex flex-col gap-8 md:grid md:grid-cols-2 md:items-center md:gap-24",
            isLeftLayout ? "" : "md:[&>*:first-child]:order-2"
          )}
        >
          {/* Image Side */}
          <div className="flex justify-center">
            {imageUrl && (
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={
                    (component.image as StrapiImageMedia)?.alternativeText ||
                    component.title ||
                    ""
                  }
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className="flex flex-col gap-4">
            {component.title && (
              <h2 className="text-3xl font-bold md:text-4xl">
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
        </div>
      </Container>
    </Section>
  )
}

StrapiImageWithText.displayName = "StrapiImageWithText"

export default StrapiImageWithText
