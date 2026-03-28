"use client"

import type { Data } from "@repo/strapi-types"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { useState } from "react"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
  StrapiSectionDescription,
  StrapiSectionTitle,
} from "@/components/page-builder/components/utilities/StrapiSectionHeader"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { RippleButton } from "@/components/ui/ripple-button"
import { cn } from "@/lib/styles"

function Card({
  slide,
  size,
}: {
  slide: Data.Component<"utilities.media-with-texts-and-link">
  size?: string
}) {
  // 根据 size 设置图片比例
  const aspectClass = size === "sm" ? "aspect-[2]" : "aspect-[4/3]"

  return (
    <div className="group relative overflow-hidden bg-white">
      {/* Image */}
      <div className="relative w-full overflow-hidden">
        {slide.media && (
          <div className={cn("w-full", aspectClass)}>
            <StrapiBasicImage
              component={slide}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Link Icon Overlay */}
        {slide.link && (
          <div className="group-hover:text-primary-700 absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-all duration-300 group-hover:bg-white">
            <ArrowUpRight className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Content */}
      {(slide.title || slide.description) && (
        <div className="p-6">
          {slide.title && (
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              {slide.title}
            </h3>
          )}
          {slide.description && (
            <p className="text-[var(--color-text-muted)]">
              {slide.description}
            </p>
          )}
        </div>
      )}

      {/* Clickable overlay */}
      {slide.link && (
        <StrapiLink
          component={slide.link}
          className="absolute inset-0 z-10 h-auto"
        >
          <span className="sr-only">{slide.title}</span>
        </StrapiLink>
      )}
    </div>
  )
}

export function StrapiCarouselWithNext({
  component,
}: {
  readonly component: Data.Component<"sections.carousel-with-next">
}) {
  const [api, setApi] = useState<CarouselApi>()

  if (!component.slides || component.slides.length === 0) {
    return null
  }

  // 复制slides以实现真正的无限循环
  const extendedSlides = [...component.slides, ...component.slides]

  const handleNext = () => {
    api?.scrollNext()
  }

  // 根据 size 设置间距
  const gapClass = component.size === "sm" ? "-ml-16" : "-ml-6"
  const paddingClass = component.size === "sm" ? "pl-16" : "pl-6"

  return (
    <Section>
      <Container className="flex flex-col">
        <div className="mb-8 md:mb-12 lg:text-center">
          <StrapiSectionTitle title={component.title} />
          <StrapiSectionDescription description={component.description} />
        </div>

        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="flex w-full flex-1 overflow-hidden">
            {/* Cards Carousel */}
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className={gapClass}>
                {extendedSlides.map((slide) => (
                  <CarouselItem
                    key={slide.id}
                    className={cn(paddingClass, "md:basis-1/2 lg:basis-1/3")}
                  >
                    <Card slide={slide} size={component.size || "md"} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <RippleButton
            onClick={handleNext}
            className="h-14 w-14 shrink-0 p-0 md:h-16 md:w-16"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          </RippleButton>
        </div>
      </Container>
    </Section>
  )
}

StrapiCarouselWithNext.displayName = "StrapiCarouselWithNext"

export default StrapiCarouselWithNext
