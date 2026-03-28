import type { Data } from "@repo/strapi-types"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"

export default function StrapiOffice({
  component,
}: {
  readonly component: Data.Component<"sections.office">
}) {
  if (!component || !component.offices || component.offices.length === 0) {
    return null
  }

  return (
    <Section>
      <Container className="flex flex-col gap-6 sm:gap-8">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {component.offices.map((office, index) => (
            <div
              key={office.id || index}
              className="relative flex flex-col items-center text-center"
            >
              {/* location */}
              {office.location && (
                <div className="z-10 -mb-4 flex h-10 w-24 flex-col items-center justify-center overflow-hidden bg-white text-2xl leading-none drop-shadow-xl sm:-mb-6 sm:h-12 sm:w-28 sm:text-3xl">
                  {office.location}
                </div>
              )}

              {/* Image */}
              {office.image && (
                <div className="border-primary-700 relative mb-6 aspect-video w-full overflow-hidden border-1 sm:mb-8">
                  <Image
                    src={office.image.url}
                    alt={
                      office.image.alternativeText || office.name || "Office"
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              )}
              {/* name */}
              {office.name && (
                <div className="z-10 mb-2 flex flex-col items-center justify-center overflow-hidden text-xl font-bold sm:mb-3 sm:text-2xl">
                  {office.name}
                </div>
              )}

              {/* Address */}
              {office.address && (
                <div className="px-2 text-sm leading-relaxed whitespace-pre-line text-gray-600 sm:text-base">
                  {office.address}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
