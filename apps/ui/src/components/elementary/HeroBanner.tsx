import Image from "next/image"
import type React from "react"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { Container } from "@/components/elementary/Container"
import { cn } from "@/lib/styles"
import type { BreadCrumb, StrapiImageMedia } from "@/types/api"

export interface HeroBannerProps {
  title: string
  description?: string | null
  breadcrumbs?: BreadCrumb[]
  className?: string
  style?: React.CSSProperties
  showDecorative?: boolean
  children?: React.ReactNode
  image?: StrapiImageMedia
  bgColor?: string
}

export function HeroBanner({
  title,
  description,
  breadcrumbs,
  className,
  style,
  image,
  bgColor,
  children,
}: HeroBannerProps) {
  return (
    <section
      className={cn(
        "bg-primary-700 relative flex items-center py-16 text-white lg:min-h-110",
        className
      )}
      style={{ ...style, backgroundColor: bgColor }}
    >
      {/* Background decorative element */}
      {image?.media?.url && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src={image?.media?.url}
            alt="Hero banner background"
            fill
            quality={100}
            className="object-cover object-right"
          />
        </div>
      )}

      <Container className="relative z-10">
        <h1 className="mb-4 text-4xl font-light md:text-5xl">{title}</h1>
        {description && (
          <p className="mb-4 max-w-2xl text-lg text-white/80">{description}</p>
        )}
        {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
        {children}
      </Container>
    </section>
  )
}
