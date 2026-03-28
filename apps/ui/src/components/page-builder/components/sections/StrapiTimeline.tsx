"use client"

import type { Data } from "@repo/strapi-types"
import { useEffect, useRef, useState } from "react"

import { Container } from "@/components/elementary/Container"
import { ImageWithFallback } from "@/components/elementary/ImageWithFallback"
import { Section } from "@/components/elementary/Section"
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
  readonly isLeft: boolean
}

function TimelineItem({ item, index, isLeft }: TimelineItemProps) {
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

  return (
    <div
      ref={itemRef}
      className={cn(
        "relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-24",
        "opacity-0 transition-all duration-700",
        isVisible && "opacity-100"
      )}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {/* Left side content */}
      <div
        className={cn(
          "flex flex-col",
          isLeft ? "md:items-end md:text-right" : "md:order-2"
        )}
      >
        {/* Year */}
        <h3
          className={cn(
            "mb-4 text-4xl font-bold md:text-left md:text-5xl",
            item.dotColor === "secondary" ? "text-left" : "text-right",
            isLeft && "md:text-right",
            item.dotColor === "secondary"
              ? "text-secondary-500"
              : "text-primary-700"
          )}
        >
          {item.year}
        </h3>

        {/* Title */}
        {item.title && (
          <h4 className="mb-2 text-xl font-semibold text-gray-900">
            {item.title}
          </h4>
        )}

        {/* Description */}
        {item.description && (
          <HtmlContent
            html={item.description}
            className="prose prose-sm max-w-none text-gray-600"
          />
        )}
      </div>

      {/* Right side content (image) */}
      <div
        className={cn(
          "flex items-center justify-center",
          isLeft ? "md:order-2" : ""
        )}
      >
        {item.image && (
          <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-lg">
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

      {/* Center dot - only visible on md+ screens */}
      <div className="absolute top-0 left-1/2 hidden -translate-x-1/2 md:block">
        <div
          className={cn(
            "h-6 w-6 rounded-full border-4 bg-white",
            dotColorClass,
            "transition-transform duration-500",
            isVisible && "scale-100",
            !isVisible && "scale-0"
          )}
        />
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
          {/* Center vertical line - only visible on md+ screens */}
          <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-gray-300 md:block" />

          {/* Timeline items */}
          <div className="space-y-16 md:space-y-24">
            {component.items.map((item, index) => (
              <TimelineItem
                key={item.id || index}
                item={item}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

StrapiTimeline.displayName = "StrapiTimeline"

export default StrapiTimeline
