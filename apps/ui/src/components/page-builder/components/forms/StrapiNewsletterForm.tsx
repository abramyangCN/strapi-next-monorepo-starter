import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { NewsletterForm } from "@/components/elementary/forms/NewsletterForm"
import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"

export function StrapiNewsletterForm({
  component,
}: {
  readonly component: Data.Component<"forms.newsletter-form">
}) {
  removeThisWhenYouNeedMe("StrapiNewsletterForm")

  return (
    <div className="bg-blue-light pb-10">
      <Container className="flex flex-col justify-between gap-y-10 lg:flex-row">
        <div className="flex w-full max-w-[510px] flex-1 flex-col gap-10">
          <h1 className="text-3xl font-bold">{component.title}</h1>
          <p>{component.description}</p>
        </div>
        <div className="flex w-full max-w-[560px] flex-1 items-end align-bottom">
          <div className="w-fll mt-1 flex w-full flex-col gap-1">
            <NewsletterForm
              newsletter={{
                title: component.title || "",
                button: component?.button || "",
                placeholder: component?.placeholder || "",
              }}
            />
            <div className="mt-2 flex items-center" />
          </div>
        </div>
      </Container>
    </div>
  )
}

StrapiNewsletterForm.displayName = "StrapiNewsletterForm"

export default StrapiNewsletterForm
