import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { ContactForm } from "@/components/elementary/forms/ContactForm"

export function StrapiContactForm({
  component,
}: {
  readonly component: Data.Component<"forms.contact-form">
}) {
  return (
    <div className="bg-white" id="form-section">
      <Container className="grid grid-cols-12">
        <div className="col-span-12 flex flex-col gap-8 bg-white p-10 drop-shadow-xl lg:col-span-8 lg:col-start-3">
          {component.title && (
            <div
              className="text-5xl"
              dangerouslySetInnerHTML={{ __html: component.title }}
            />
          )}
          <ContactForm
            gdpr={{
              href: component.gdpr?.href ?? undefined,
              label: component.gdpr?.label ?? undefined,
              newTab: component.gdpr?.newTab ?? false,
            }}
          />
        </div>
      </Container>
    </div>
  )
}

StrapiContactForm.displayName = "StrapiContactForm"

export default StrapiContactForm
