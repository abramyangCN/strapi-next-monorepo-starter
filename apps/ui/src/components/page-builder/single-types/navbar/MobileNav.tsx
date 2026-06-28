"use client"

import type { Data } from "@repo/strapi-types"
import { Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Suspense, useState } from "react"

import AppLink from "@/components/elementary/AppLink"
import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import { LoggedUserMenu } from "@/components/page-builder/single-types/navbar/LoggedUserMenu"
import { cn } from "@/lib/styles"
import type { BetterAuthSessionWithStrapi } from "@/types/better-auth"
import type { AppLocale } from "@/types/general"

interface MobileNavProps {
  readonly links: Data.Component<"utilities.sub-link">[]
  readonly locale: AppLocale
  readonly session: BetterAuthSessionWithStrapi | null
  readonly enableAuth: boolean
}

export function MobileNav({
  links,
  locale,
  session,
  enableAuth,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("navbar")

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <div className="flex items-center lg:hidden">
      {/* Hamburger Menu Button */}
      <button
        type="button"
        onClick={toggleMenu}
        className="relative z-50 flex h-10 w-10 items-center justify-center"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="text-primary-700 h-6 w-6" />
        )}
      </button>

      {/* Full Screen Mobile Menu */}
      <div
        className={cn(
          "bg-primary-700 fixed inset-0 z-40 flex h-screen w-screen flex-col overflow-auto p-4 pt-20 transition-all duration-300 ease-in-out",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        {/* Menu Content */}
        <nav className="flex flex-1 flex-col items-start justify-start gap-2">
          {links.map((link) => {
            const hasSubMenu = link.links && link.links.length > 0

            if (hasSubMenu) {
              return (
                <div
                  key={link.href ?? link.label}
                  className="flex flex-col items-start"
                >
                  <AppLink
                    href={link.href ?? "/"}
                    onClick={closeMenu}
                    className="px-4 py-2 text-base font-semibold text-white hover:text-white/80"
                    target={link.newTab ? "_blank" : undefined}
                  >
                    {link.label}
                  </AppLink>
                  <div className="flex flex-col items-start pl-4">
                    {link.links?.map((subLink) => (
                      <AppLink
                        key={subLink.href ?? subLink.label}
                        href={subLink.href ?? "/"}
                        onClick={closeMenu}
                        className="py-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white/60"
                        target={subLink.newTab ? "_blank" : undefined}
                      >
                        {subLink.label}
                      </AppLink>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <AppLink
                key={link.href ?? link.label}
                href={link.href ?? "/"}
                onClick={closeMenu}
                className="text-base font-semibold text-white transition-colors hover:text-white/80"
                target={link.newTab ? "_blank" : undefined}
              >
                {link.label}
              </AppLink>
            )
          })}
        </nav>

        {/* Bottom Section - Auth & Language Switcher */}
        <div className="flex flex-col items-center gap-4 pt-4">
          {enableAuth && (
            <>
              {session?.user ? (
                <div className="text-white">
                  <LoggedUserMenu user={session.user} />
                </div>
              ) : (
                <AppLink
                  href="/auth/signin"
                  onClick={closeMenu}
                  className="text-lg font-medium text-white transition-colors hover:text-white/80"
                >
                  {t("actions.signIn")}
                </AppLink>
              )}
            </>
          )}
          <Suspense fallback={<div className="h-10 w-18" />}>
            <LocaleSwitcher
              locale={locale}
              inline
              className="border-t border-white/20 pt-4"
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

MobileNav.displayName = "MobileNav"
