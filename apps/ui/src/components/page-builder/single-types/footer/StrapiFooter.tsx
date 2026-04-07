import type { Data } from "@repo/strapi-types"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { NewsletterForm } from "@/components/elementary/forms/NewsletterForm"
import { MoveUpRightSVG } from "@/components/elementary/icons"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { Divider } from "@/components/ui/divider"
import { HtmlContent } from "@/components/ui/html-content"
import { fetchFooter } from "@/lib/strapi-api/content/server"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import type { AppLocale } from "@/types/general"

export async function StrapiFooter({ locale }: { readonly locale: AppLocale }) {
  const response = await fetchFooter(locale)
  const component =
    response?.data as Data.ContentType<"api::footer.footer"> | null

  if (component == null) {
    return null
  }

  const { newsletter, affiliates, sections, contact, socialMedias } = component

  // 分离 wechat 和其他社交媒体
  const wechatMedia = socialMedias?.find((social) => social.social === "wechat")
  const otherSocialMedias = socialMedias?.filter(
    (social) => social.social !== "wechat"
  )

  return (
    <footer className="bg-primary-700 w-full text-white">
      {/* Newsletter Section */}
      <Container className="flex flex-col gap-8 py-12 md:gap-12 md:py-40">
        {newsletter && (
          <div className="flex flex-col justify-start gap-6 md:flex-row md:items-start md:gap-8">
            <h2 className="flex-1 shrink-0 text-2xl font-semibold md:text-3xl lg:text-5xl">
              {newsletter.title}
            </h2>
            <div className="flex flex-col justify-start md:max-w-md">
              <NewsletterForm
                newsletter={{
                  title: newsletter.title || "",
                  button: newsletter.button || undefined,
                  gdpr: newsletter.gdpr || undefined,
                  placeholder: newsletter.placeholder || undefined,
                }}
              />
              {newsletter.gdpr && (
                <HtmlContent
                  html={newsletter.gdpr}
                  className="mt-3 text-sm text-white [&_a]:underline"
                />
              )}
            </div>
          </div>
        )}
        <Divider />

        {/* Affiliates Section - Horizontal logos with descriptions */}
        {affiliates && affiliates.length > 0 && (
          <div className="flex w-full flex-col gap-8 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-16 lg:py-12">
            {affiliates.map((affiliate, i) => (
              <div
                className="flex w-full flex-col items-start gap-6 md:flex-row md:items-center md:justify-between"
                key={affiliate.id ?? i}
              >
                <div className="flex flex-col gap-3 md:gap-4">
                  {affiliate.title && (
                    <div className="text-3xl font-bold md:text-4xl lg:text-5xl">
                      {affiliate.title}
                    </div>
                  )}
                  {affiliate.description && (
                    <div className="text-xs whitespace-pre text-white">
                      {affiliate.description}
                    </div>
                  )}
                </div>
                <StrapiLink
                  component={affiliate.logo?.link}
                  className="group transition-opacity hover:opacity-80"
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    {affiliate.logo?.image?.media?.url && (
                      <Image
                        src={
                          formatStrapiMediaUrl(
                            affiliate.logo.image.media.url
                          ) ?? ""
                        }
                        alt={affiliate.title ?? ""}
                        width={affiliate.logo.image.media.width ?? 120}
                        height={affiliate.logo.image.media.height ?? 60}
                        className="w-50 object-contain md:w-60 lg:w-75"
                      />
                    )}
                    <div className="text-primary-700 flex h-10 w-10 items-center justify-center rounded-full bg-white lg:h-12 lg:w-12">
                      <MoveUpRightSVG className="size-10 lg:size-12" />
                    </div>
                  </div>
                </StrapiLink>
              </div>
            ))}
          </div>
        )}

        {/* Main Footer Content */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:gap-12 lg:gap-24">
          <div className="flex flex-row items-start gap-6 md:flex-col md:gap-4">
            {/* WeChat QR Code Section */}
            {wechatMedia && (
              <div className="relative">
                {wechatMedia.icon?.url && (
                  <Image
                    src={formatStrapiMediaUrl(wechatMedia.icon.url) ?? ""}
                    alt="WeChat QR Code"
                    width={wechatMedia.icon?.width ?? 120}
                    height={wechatMedia.icon?.height ?? 120}
                    className="aspect-square w-28 rounded-lg object-contain md:w-40"
                  />
                )}
              </div>
            )}

            {/* Other Social Media Links */}
            {otherSocialMedias && otherSocialMedias.length > 0 && (
              <div className="flex items-center gap-4">
                {otherSocialMedias.map((social, i) => {
                  const socialIconMap: Record<
                    string,
                    typeof Instagram | undefined
                  > = {
                    instagram: Instagram,
                    facebook: Facebook,
                    linkedin: Linkedin,
                  }
                  const SocialIcon = socialIconMap[social.social ?? ""]

                  if (!SocialIcon) return null

                  return (
                    <div
                      key={social.id ?? i}
                      className="flex w-full justify-between"
                    >
                      {social.link?.href ? (
                        <StrapiLink
                          component={social.link}
                          className="block p-0 transition-opacity hover:opacity-80"
                        >
                          <SocialIcon className="h-6 w-6 text-white" />
                        </StrapiLink>
                      ) : (
                        <SocialIcon className="h-6 w-6 text-white" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-12 md:shrink-0 md:gap-16">
            {sections?.map((section, sectionIndex) => (
              <div
                key={section.id ?? sectionIndex}
                className="flex shrink-0 flex-col items-start gap-4 md:gap-12"
              >
                <h3 className="text-lg font-semibold md:text-xl">
                  {section.title}
                </h3>
                <div className="flex flex-col items-start gap-2">
                  {section.links?.map((link, i) => (
                    <StrapiLink
                      key={link.id ?? i}
                      component={link}
                      className="p-0 text-sm text-white transition-colors"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          {contact && (
            <div className="flex flex-col gap-4 md:gap-12">
              <h3 className="text-lg font-semibold md:text-xl">
                {contact.title}
              </h3>
              <div className="flex flex-col gap-2 text-sm md:text-base">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="hover:text-secondary-400 h-9"
                  >
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-secondary-400 h-9"
                  >
                    {contact.email}
                  </a>
                )}
                {contact.address && (
                  <p className="whitespace-pre-line">{contact.address}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </footer>
  )
}

StrapiFooter.displayName = "StrapiFooter"

export default StrapiFooter
