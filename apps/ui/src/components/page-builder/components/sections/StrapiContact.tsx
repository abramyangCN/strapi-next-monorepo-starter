import type { Data } from "@repo/strapi-types"
import { Mail, MapPin, Phone } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { ContactForm } from "@/components/elementary/forms/ContactForm"
import { Section } from "@/components/elementary/Section"

interface StrapiContactProps {
  readonly component: Data.Component<"sections.contact">
}

export function StrapiContact({ component }: StrapiContactProps) {
  const contactItems = [
    {
      icon: Phone,
      label: component.phone?.key || "Contact",
      value: component.phone?.value,
    },
    {
      icon: Mail,
      label: component.email?.key || "Email",
      value: component.email?.value,
    },
    {
      icon: MapPin,
      label: component.address?.key || "China Office",
      value: component.address?.value,
    },
  ].filter((item) => item.value)

  return (
    <Section className="bg-background">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Contact Info */}
          <div>
            {/* Title */}
            {component.title && (
              <div
                className="prose prose-3xl mb-6 max-w-none text-3xl font-thin md:text-4xl lg:text-5xl"
                dangerouslySetInnerHTML={{ __html: component.title }}
              />
            )}

            {/* Contact Items */}
            <div className="space-y-4 sm:space-y-6">
              {contactItems.map((item, index) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 sm:gap-4"
                  >
                    {/* Icon */}
                    <div className="bg-primary-700 flex h-12 w-12 flex-shrink-0 items-center justify-center text-white sm:h-15 sm:w-15">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-base font-semibold text-gray-900 sm:mb-2 sm:text-lg">
                        {item.label}
                      </h3>
                      <div className="text-sm break-words whitespace-pre-line text-gray-600 sm:text-base">
                        {item.value}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Side - Slogan or Form */}
          {component.rightContent === "form" ? (
            <div className="flex flex-col gap-6 bg-white p-6 drop-shadow-xl sm:gap-8 sm:p-8 lg:p-10">
              {component.formTitle && (
                <div
                  className="prose prose-base max-w-none text-2xl sm:mb-6 lg:mb-4 lg:text-4xl"
                  dangerouslySetInnerHTML={{ __html: component.formTitle }}
                />
              )}
              <div className="w-full">
                <ContactForm
                  gdpr={{
                    href: component.gdpr?.href ?? undefined,
                    label: component.gdpr?.label ?? undefined,
                    newTab: component.gdpr?.newTab ?? false,
                  }}
                />
              </div>
            </div>
          ) : (
            component.slogan && (
              <div className="flex items-start justify-start">
                <div
                  className="prose prose-xl sm:prose-2xl max-w-none text-2xl font-thin sm:text-3xl md:text-4xl lg:text-5xl"
                  dangerouslySetInnerHTML={{ __html: component.slogan }}
                />
              </div>
            )
          )}
        </div>
      </Container>
    </Section>
  )
}

StrapiContact.displayName = "StrapiContact"

export default StrapiContact
