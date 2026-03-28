import type { Data } from "@repo/strapi-types"

import { AnimatedNumber } from "@/components/elementary/AnimatedNumber"
import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import { cn } from "@/lib/styles"

interface StrapiAnimatedNumbersProps {
  readonly component: Data.Component<"sections.animated-numbers">
}

export function StrapiAnimatedNumbers({
  component,
}: StrapiAnimatedNumbersProps) {
  const backgroundColor = component.background || "#ffffff"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const numberGroup = (component as any).numberGroup as
    | { number?: string; title?: string }[]
    | undefined

  if (!numberGroup || numberGroup.length === 0) {
    return null
  }

  return (
    <Section style={{ backgroundColor }} className="py-12 md:py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-3 md:gap-12 lg:gap-16">
          {numberGroup?.map((item, index) => {
            // Parse the number from string (handles numbers like "110", "3500", "115")
            const numericValue = Number.parseFloat(item.number || "0")

            return (
              <div
                key={`${item.number}-${item.title}`}
                className="flex flex-col items-center gap-2 text-center md:gap-3"
              >
                <AnimatedNumber
                  value={numericValue}
                  duration={2.5}
                  className={cn(
                    "text-4xl leading-none font-bold sm:text-5xl md:text-6xl lg:text-7xl",
                    backgroundColor === "#ffffff"
                      ? "text-primary-700"
                      : "text-secondary-400"
                  )}
                />
                <p
                  className={cn(
                    "text-base font-semibold sm:text-lg md:text-xl",
                    backgroundColor === "#ffffff"
                      ? "text-gray-700"
                      : "text-black/90"
                  )}
                >
                  {item.title}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

StrapiAnimatedNumbers.displayName = "StrapiAnimatedNumbers"

export default StrapiAnimatedNumbers
