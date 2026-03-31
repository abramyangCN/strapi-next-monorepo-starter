import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { StrapiSectionDescription } from "@/components/page-builder/components/utilities/StrapiSectionHeader"
import { cn } from "@/lib/styles"

type GridImageComponent = {
  style?: string
  columns?: "2" | "4"
  title?: string
  description?: string
  enableBgColor?: boolean
  bgColor?: string
  link?: Data.Component<"utilities.link"> | null
  items: {
    id?: number | string
    title?: string
    media?: { url: string; alternativeText?: string }
    link?: Data.Component<"utilities.link"> | null
  }[]
}

export default function StrapiGridImage({
  component,
}: {
  readonly component: GridImageComponent
}) {
  if (!component || !component.items || component.items.length === 0) {
    return null
  }

  const style = component.style || "left"
  const columns = component.columns || "4"
  const ctaGridClass =
    columns === "2"
      ? "aspect-square flex items-end justify-end bg-[#5fb89a] text-white transition-colors hover:bg-[#4fa688] active:bg-[#4a9a7d]"
      : "col-span-2 row-span-2 aspect-square flex items-end justify-end bg-[#5fb89a] text-white transition-colors hover:bg-[#4fa688] active:bg-[#4a9a7d] lg:col-start-4 lg:row-start-3"

  // Style: Left or Right - Card + Grid layout
  return (
    <Section
      className={cn(
        style === "left" && "lg:mb-8",
        style === "right" && "lg:mt-8",
        component.enableBgColor && component.bgColor ? "" : undefined
      )}
      style={{
        backgroundColor:
          component.enableBgColor && component.bgColor
            ? component.bgColor
            : undefined,
      }}
    >
      <Container>
        <div
          className={cn(
            "flex flex-col items-start gap-8 lg:flex-row lg:gap-12",
            style === "left" && "lg:items-end"
          )}
        >
          {/* Text Card - Left side for 'left' style */}
          {style === "left" && (
            <div className="relative flex flex-col items-end justify-center lg:w-5/12">
              <div className="bg-[#1a4d5c] px-6 py-10 text-white sm:px-8 sm:py-16 lg:absolute lg:-bottom-24 lg:px-12 lg:py-20">
                {component.title && (
                  <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
                    {component.title}
                  </h2>
                )}
                {component.description && (
                  <div className="prose prose-invert text-base leading-relaxed">
                    <StrapiSectionDescription
                      description={component.description}
                      className="text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grid Items */}
          <div className="w-full lg:w-7/12">
            <div
              className={cn(
                "grid gap-2 sm:gap-3 lg:gap-4",
                columns === "2"
                  ? "grid-cols-2"
                  : "grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              )}
            >
              {component.items.map((item, index) => (
                <div
                  key={item.id ?? index}
                  className="group relative aspect-square overflow-hidden bg-white shadow-sm transition-all hover:shadow-lg active:scale-95"
                >
                  {item.media && (
                    <Image
                      src={item.media.url}
                      alt={item.media.alternativeText || item.title || ""}
                      fill
                      className="object-cover"
                    />
                  )}
                  {item.title && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <p className="text-center text-xs text-white sm:text-sm">
                        {item.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* CTA Button as last grid item */}
              {component.link && (
                <div className={ctaGridClass}>
                  <StrapiLink
                    component={component.link}
                    className="flex h-full w-full flex-col items-end gap-3 px-6 py-8 text-center sm:gap-4 sm:px-10 sm:py-12 lg:px-14 lg:py-16"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white transition-transform group-hover:translate-x-1 group-hover:opacity-30 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                      <ArrowRight className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                    </div>
                    <span className="text-base font-light tracking-wider uppercase sm:text-lg lg:text-xl">
                      {component.link.label || "Get a Quote"}
                    </span>
                  </StrapiLink>
                </div>
              )}
            </div>
          </div>

          {/* Text Card - Right side for 'right' style */}
          {style === "right" && (
            <div className="relative order-first flex flex-col justify-center lg:order-none lg:w-5/12">
              <div className="bg-[#1a4d5c] px-6 py-10 text-white sm:px-8 sm:py-16 lg:absolute lg:-top-24 lg:px-12 lg:py-20">
                {component.title && (
                  <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
                    {component.title}
                  </h2>
                )}
                {component.description && (
                  <div className="prose prose-invert text-base leading-relaxed">
                    <StrapiSectionDescription
                      description={component.description}
                      className="text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}
