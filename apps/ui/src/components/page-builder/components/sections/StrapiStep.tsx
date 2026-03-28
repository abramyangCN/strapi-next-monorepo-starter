import type { Data } from "@repo/strapi-types"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { Section } from "@/components/elementary/Section"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"

interface StrapiStepProps {
  readonly component: Data.Component<"sections.step">
}

export function StrapiStep({ component }: StrapiStepProps) {
  removeThisWhenYouNeedMe("StrapiStep")

  return (
    <Section className="bg-background">
      <Container>
        {/* Top Forms - Two columns */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:gap-6 lg:mb-16">
          {/* Form 1 */}
          {component.form1 && (
            <StrapiLink
              component={component.form1}
              className="bg-primary-700 hover:bg-primary-800 active:bg-primary-900 relative flex h-20 flex-1 items-center justify-between overflow-hidden rounded-none px-6 text-white transition-all duration-300 hover:text-white sm:h-25 sm:px-10 hover:sm:flex-[1.5]"
            >
              <span className="text-xl font-light sm:text-2xl lg:text-3xl">
                {component.form1.label}
              </span>
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white transition-transform group-hover:translate-x-1 sm:h-12 sm:w-12">
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </StrapiLink>
          )}

          {/* Form 2 */}
          {component.form2 && (
            <StrapiLink
              component={component.form2}
              className="bg-secondary-400 hover:bg-secondary-500 active:bg-secondary-600 relative flex h-20 flex-1 items-center justify-between overflow-hidden rounded-none px-6 text-white transition-all duration-300 hover:text-white sm:h-25 sm:px-10 hover:sm:flex-[1.5]"
            >
              <span className="text-xl font-light sm:text-2xl lg:text-3xl">
                {component.form2.label}
              </span>
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white transition-transform group-hover:translate-x-1 sm:h-12 sm:w-12">
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </StrapiLink>
          )}
        </div>

        {/* Steps - Four columns */}
        {component.steps && component.steps.length > 0 && (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {component.steps.map((step) => (
              <div
                key={step.id}
                className="group border-primary-700 text-primary-900 hover:bg-primary-700 relative border-2 bg-white p-6 transition-all group-hover:text-white hover:shadow-lg sm:p-8"
              >
                {/* Number */}
                <div className="mb-4 sm:mb-6">
                  <span className="text-primary-700 text-4xl font-bold transition-colors group-hover:text-white sm:text-5xl">
                    {step.number}
                  </span>
                </div>

                {/* Title/Content */}
                {step.title && (
                  <div
                    className="prose prose-sm sm:prose-base max-w-none"
                    dangerouslySetInnerHTML={{ __html: step.title }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

StrapiStep.displayName = "StrapiStep"

export default StrapiStep
