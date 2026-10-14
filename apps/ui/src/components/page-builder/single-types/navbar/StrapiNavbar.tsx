import type { Data } from "@repo/strapi-types"
import { headers } from "next/headers"
import Image from "next/image"
import type { Locale } from "next-intl"
import { Suspense } from "react"

import AppLink from "@/components/elementary/AppLink"
import { Container } from "@/components/elementary/Container"
import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import { MobileNav } from "@/components/page-builder/single-types/navbar/MobileNav"
import { NavbarAuthSection } from "@/components/page-builder/single-types/navbar/NavbarAuthSection"
import { NavbarLinks } from "@/components/page-builder/single-types/navbar/NavbarLinks"
import { getSessionSSR } from "@/lib/auth"
import { fetchNavbar } from "@/lib/strapi-api/content/server"
import type { AppLocale } from "@/types/general"

type PopulatedNavbar = {
  links?: Data.Component<"utilities.sub-link">[] | null
  logoImage?: Data.Component<"utilities.image-with-link"> | null
}

const enableAuth = process.env.APP_ENABLE_AUTH === "true"

export async function StrapiNavbar({ locale }: { readonly locale: Locale }) {
  const response = await fetchNavbar(locale)
  const navbar = response?.data as
    | (PopulatedNavbar & { documentId: string })
    | null
    | undefined

  if (navbar == null) {
    return null
  }

  const links = (navbar.links ?? []).filter((link) => link.href)

  const session = enableAuth ? await getSessionSSR(await headers()) : null

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center border-b bg-white shadow-sm backdrop-blur transition-colors duration-300 lg:h-25">
      <Container className="flex justify-between">
        <div>
          {navbar.logoImage ? (
            <StrapiImageWithLink
              component={navbar.logoImage}
              linkProps={{ className: "flex items-center h-auto p-0" }}
              imageProps={{
                forcedSizes: { width: 188, height: 60 },
                hideWhenMissing: true,
              }}
            />
          ) : (
            <AppLink href="/" className="text-xl font-bold">
              <Image src="/images/logo.svg" alt="logo" height={23} width={82} />
            </AppLink>
          )}
        </div>
        {/* Desktop Navigation */}
        <div className="hidden gap-6 lg:flex lg:gap-10">
          <NavbarLinks links={links} />
          <div className="flex flex-1 items-center justify-end space-x-4">
            {enableAuth && <NavbarAuthSection sessionSSR={session} />}
            <Suspense fallback={<div className="h-10 w-18" />}>
              <LocaleSwitcher locale={locale as AppLocale} />
            </Suspense>
          </div>
        </div>
        {/* Mobile Navigation */}
        <MobileNav
          links={links}
          locale={locale as AppLocale}
          session={session}
          enableAuth={enableAuth}
        />
      </Container>
    </header>
  )
}

StrapiNavbar.displayName = "StrapiNavbar"

export default StrapiNavbar
