import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { QuotationForm } from "@/components/elementary/forms/QuotationForm"
import { Section } from "@/components/elementary/Section"

export default function StrapiQuotationForm({
  component,
}: {
  readonly component: Data.Component<"forms.quotation-form">
}) {
  if (!component) {
    return null
  }

  const { formType, title, gdpr, buttonText, sampleDocumentLink } = component

  if (!formType || (formType !== "low-volume" && formType !== "prototyping")) {
    return null
  }

  return (
    <Section className="px-4 pt-0 sm:px-6 lg:px-8">
      <Container className="flex w-full flex-col items-start gap-4 bg-white p-6 drop-shadow-md sm:gap-6 sm:p-8 md:gap-8 md:p-12 lg:p-16 lg:px-20">
        {title && (
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h2>
        )}
        <QuotationForm
          formType={formType}
          gdpr={
            gdpr
              ? {
                  href: gdpr.href || undefined,
                  label: gdpr.label || undefined,
                  newTab: gdpr.newTab || undefined,
                }
              : undefined
          }
          buttonText={buttonText || undefined}
          sampleDocumentLink={
            sampleDocumentLink
              ? {
                  href: sampleDocumentLink.href || undefined,
                  label: sampleDocumentLink.label || undefined,
                  newTab: sampleDocumentLink.newTab || undefined,
                }
              : undefined
          }
        />
      </Container>
    </Section>
  )
}
