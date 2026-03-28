"use client"

import type { Data } from "@repo/strapi-types"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { NavbarDropdown } from "@/components/page-builder/single-types/navbar/NavbarDropdown"
import { cn } from "@/lib/styles"

interface NavbarLinksProps {
  readonly links: Data.Component<"utilities.sub-link">[]
}

export function NavbarLinks({ links }: NavbarLinksProps) {
  if (links.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center justify-center gap-6">
      {links.map((link) => {
        const hasSubMenu = link.links && link.links.length > 0

        if (hasSubMenu) {
          return (
            <NavbarDropdown
              key={link.href ?? link.label}
              mainLink={link}
              className="p-0 py-4"
            />
          )
        }

        return (
          <StrapiLink
            component={link}
            key={link.href ?? link.label}
            className={cn("flex items-center p-0 text-base font-medium")}
          />
        )
      })}
    </nav>
  )
}

NavbarLinks.displayName = "NavbarLinks"
