"use client"

import type { Data } from "@repo/strapi-types"
import { useEffect, useRef, useState } from "react"

import { Container } from "@/components/elementary/Container"
import { ImageWithFallback } from "@/components/elementary/ImageWithFallback"
import { Section } from "@/components/elementary/Section"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
  StrapiSectionDescription,
  StrapiSectionTitle,
} from "@/components/page-builder/components/utilities/StrapiSectionHeader"
import { HtmlContent } from "@/components/ui/html-content"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"
import type { StrapiImageMedia } from "@/types/api"

interface TimelineItemProps {
  readonly item: Data.Component<"utilities.timeline-item">
  readonly index: number
  readonly isLast: boolean
}

function TimelineItem({ item, index, isLast }: TimelineItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = itemRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    )

    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const dotColorClass =
    item.dotColor === "secondary"
      ? "bg-secondary-500 border-secondary-500"
      : "bg-primary-700 border-primary-700"

  const yearColorClass =
    item.dotColor === "secondary" ? "text-secondary-500" : "text-primary-700"

  return (
    <div
      ref={itemRef}
      className={cn(
        "flex gap-4 lg:gap-16",
        "opacity-0 transition-all duration-700",
        isVisible && "opacity-100"
      )}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {/* Year column */}
      <div className="shrink-0 pt-0.5 text-right">
        <h3
          className={cn(
            "text-xl leading-tight font-bold lg:text-2xl",
            yearColorClass
          )}
        >
          {item.year}
        </h3>
      </div>

      {/* Dot + vertical line column */}
      <div className="flex shrink-0 flex-col items-center">
        <div
          className={cn(
            "mt-1 h-4 w-4 shrink-0 rounded-full border-4 bg-white",
            dotColorClass,
            "transition-transform duration-500",
            isVisible ? "scale-100" : "scale-0"
          )}
        />
        {!isLast && <div className="mt-1 w-0.5 flex-1 bg-gray-300" />}
      </div>

      {/* Content column */}
      <div className={cn("min-w-0 flex-1 pb-4 lg:pb-8", isLast && "pb-0")}>
        {/* Title */}
        {item.title && (
          <h4 className="mb-1 text-base font-semibold text-gray-900 sm:text-lg">
            {item.title}
          </h4>
        )}

        {/* Description */}
        {item.description && (
          <HtmlContent
            html={item.description}
            className="prose prose-sm lg:prose-lg max-w-none text-gray-600"
          />
        )}

        {/* Image */}
        {item.image && (
          <div className="relative mt-3 h-36 w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-lg">
            <ImageWithFallback
              src={
                formatStrapiMediaUrl((item.image as StrapiImageMedia)?.url) ??
                ""
              }
              alt={
                (item.image as StrapiImageMedia)?.alternativeText ||
                item.title ||
                item.year ||
                ""
              }
              width={(item.image as StrapiImageMedia)?.width || 400}
              height={(item.image as StrapiImageMedia)?.height || 300}
              className="h-full w-full object-contain p-4"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function StrapiTimeline({
  component,
}: {
  readonly component: Data.Component<"sections.timeline">
}) {
  if (!component.items || component.items.length === 0) {
    return null
  }

  return (
    <Section
      className={component.enableBgColor && component.bgColor ? "" : undefined}
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
          <div className="mb-16 flex flex-col items-center text-center">
            <StrapiSectionTitle title={component.title} />
            <StrapiSectionDescription description={component.description} />
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Timeline items */}
          <div className="flex flex-col">
            {component.items.map((item, index) => (
              <TimelineItem
                key={item.id || index}
                item={item}
                index={index}
                isLast={index === (component.items?.length ?? 0) - 1}
              />
            ))}
          </div>
        </div>

        {/* Bottom link */}
        {component.link && (
          <div className="mt-10 flex justify-center">
            <StrapiLink component={component.link} variant="primary" />
          </div>
        )}
      </Container>
    </Section>
  )
}

StrapiTimeline.displayName = "StrapiTimeline"

export default StrapiTimeline
