import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
  StrapiSectionDescription,
  StrapiSectionTitle,
} from "@/components/page-builder/components/utilities/StrapiSectionHeader"
import { cn } from "@/lib/styles"

type GridImageComponent = {
  style?: string
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

  const style = component.style || "none"

  // Style: None - Original centered layout
  if (style === "none") {
    return (
      <Section
        className={cn(
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
          {/* Section Header */}
          {(component.title || component.description) && (
            <div className="mb-12 flex flex-col items-center text-center">
              <StrapiSectionTitle title={component.title} />
              <StrapiSectionDescription description={component.description} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-8">
            {component.items.map((item, index) => (
              <div
                key={item.id ?? index}
                className="group flex flex-col overflow-hidden bg-white transition-all duration-300 hover:z-10 hover:scale-125 hover:rounded-4xl hover:shadow-lg"
              >
                {/* Image */}
                {item.media && (
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={item.media.url}
                      alt={item.media.alternativeText || item.title || ""}
                      fill
                      className="object-cover transition-transform group-hover:scale-150"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex justify-center py-3">
                  {item.title && <h3 className="text-base">{item.title}</h3>}

                  {item.link?.href && (
                    <div className="mt-auto">
                      <StrapiLink
                        component={item.link}
                        className="text-primary-700 inline-flex items-center font-medium hover:underline"
                      >
                        <svg
                          className="ml-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </StrapiLink>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Section Link */}
          {component.link && (
            <div className="mt-12 flex justify-center">
              <StrapiLink component={component.link} variant="primary" />
            </div>
          )}
        </Container>
      </Section>
    )
  }

  // Style: Left or Right - Card + Grid layout
  return (
    <Section
      className={cn(
        style === "left" && "lg:mb-36",
        style === "right" && "lg:mt-36",
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
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-12">
          {/* Text Card - Left side for 'left' style */}
          {style === "left" && (
            <div className="flex flex-col justify-center lg:w-5/12 lg:translate-y-36">
              <div className="bg-[#1a4d5c] px-6 py-10 text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20">
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
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
                <div className="col-span-2 row-span-2 flex items-end justify-end bg-[#5fb89a] text-white transition-colors hover:bg-[#4fa688] active:bg-[#4a9a7d] sm:col-start-2 md:col-start-3 lg:col-start-4 lg:row-start-3">
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
            <div className="order-first flex flex-col justify-center lg:order-none lg:w-5/12 lg:-translate-y-36">
              <div className="bg-[#1a4d5c] px-6 py-10 text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20">
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
