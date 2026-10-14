import type { Data } from "@repo/strapi-types"
import { Check } from "lucide-react"
import Image from "next/image"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { Container } from "@/components/elementary/Container"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { cn } from "@/lib/styles"
import type { BreadCrumb } from "@/types/api"

export function StrapiHero({
  component,
  meta,
}: {
  readonly component: Data.Component<"sections.hero">
  readonly meta?: { breadcrumbs?: BreadCrumb[] }
}) {
  return (
    <section
      className={cn(
        "bg-primary-700 relative flex items-center py-16 text-white lg:min-h-110"
      )}
      style={
        component.bgColor ? { backgroundColor: component.bgColor } : undefined
      }
    >
      {component.image?.media?.url && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src={component.image.media.url}
            alt={component.image.media.alternativeText ?? ""}
            fill
            quality={100}
            className="object-cover object-right"
          />
        </div>
      )}

      <Container className="relative z-10">
        <h1 className="mb-4 text-4xl font-light md:text-5xl">
          {component.title}
        </h1>

        {component.subTitle && (
          <p className="mb-4 max-w-2xl text-lg text-white/80">
            {component.subTitle}
          </p>
        )}

        {meta?.breadcrumbs && (
          <Breadcrumbs breadcrumbs={meta.breadcrumbs} className="mb-4" />
        )}

        {component?.steps && component.steps.length > 0 && (
          <ul className="mb-4 flex flex-col gap-2">
            {component.steps.map((step) => (
              <li key={step.id} className="flex items-center gap-2">
                <Check className="shrink-0" />
                <span>{step.text}</span>
              </li>
            ))}
          </ul>
        )}

        {component.links && component.links.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {component.links.map((link) => (
              <StrapiLink
                key={link.id}
                component={link}
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-base font-medium text-neutral-900 transition-colors hover:bg-white/90 focus:ring-2 focus:ring-white focus:outline-none"
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiHero.displayName = "StrapiHero"

export default StrapiHero
