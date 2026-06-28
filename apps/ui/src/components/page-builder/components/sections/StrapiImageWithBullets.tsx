import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { MoveUpRightSVG } from "@/components/elementary/icons"
import { ImageWithFallback } from "@/components/elementary/ImageWithFallback"
import { Section } from "@/components/elementary/Section"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
  StrapiSectionDescription,
  StrapiSectionTitle,
} from "@/components/page-builder/components/utilities/StrapiSectionHeader"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import type { StrapiImageMedia } from "@/types/api"

export function StrapiImageWithBullets({
  component,
}: {
  readonly component: Data.Component<"sections.image-with-bullets">
}) {
  return (
    <Section>
      <Container className="flex grid-cols-12 flex-col gap-0 lg:grid lg:gap-12">
        <StrapiSectionTitle
          className="col-span-12 lg:text-center"
          title={component.title}
        />

        {/* Image Section */}
        <div className="col-span-5 flex flex-col gap-4 md:gap-8">
          <StrapiSectionDescription description={component.description} />

          {component.image && (
            <ImageWithFallback
              src={
                formatStrapiMediaUrl(
                  (component.image as StrapiImageMedia)?.url
                ) ?? ""
              }
              alt={(component.image as StrapiImageMedia)?.alternativeText || ""}
              width={(component.image as StrapiImageMedia)?.width || 600}
              height={(component.image as StrapiImageMedia)?.height || 400}
              className="h-auto w-full object-cover"
            />
          )}
        </div>

        {/* Bullets Section */}
        <div className="col-span-7 flex flex-col justify-center gap-2 md:gap-4">
          {component.bullets?.map((bullet) => (
            <BulletItem key={bullet.id} bullet={bullet} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

interface BulletItemProps {
  readonly bullet: Data.Component<"utilities.bullet-list">
}

function BulletItem({ bullet }: BulletItemProps) {
  return (
    <div className="group hover:bg-primary-700 user-select-none relative flex cursor-pointer items-start gap-3 bg-transparent p-4 transition-all duration-300 md:gap-5 md:p-8">
      {/* Bullet Number */}
      <span className="text-primary-700 mt-2 text-3xl font-bold group-hover:text-white md:mt-4 md:text-5xl">
        {bullet.bullet}
      </span>

      {/* Content */}
      <div className="flex-1">
        {bullet.title && (
          <h3 className="mb-1 text-base font-semibold text-gray-900 group-hover:text-white md:text-xl">
            {bullet.title}
          </h3>
        )}
        {bullet.description && (
          <p className="user-select-none text-sm text-gray-600 group-hover:text-white/80 md:text-xl">
            {bullet.description}
          </p>
        )}
      </div>

      {/* Arrow Icon */}
      <div className="border-primary-700 bg-primary-700 group-hover:text-primary-700 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-white group-hover:border-white/30 group-hover:bg-white md:h-12 md:w-12">
        <MoveUpRightSVG className="size-6 lg:size-10" />
      </div>
      <StrapiLink
        className="absolute inset-0 z-10 h-full w-full"
        component={bullet.link}
      />
    </div>
  )
}

StrapiImageWithBullets.displayName = "StrapiImageWithBullets"

export default StrapiImageWithBullets
