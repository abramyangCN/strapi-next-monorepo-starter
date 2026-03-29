import type { Data } from "@repo/strapi-types"
import { ChevronDown } from "lucide-react"

import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { cn } from "@/lib/styles"

interface NavbarDropdownProps {
  readonly mainLink: Data.Component<"utilities.sub-link">
  readonly className?: string
}

export function NavbarDropdown({ mainLink, className }: NavbarDropdownProps) {
  const subLinks = mainLink.links || []

  return (
    <div className="group relative">
      <StrapiLink
        component={mainLink}
        className={cn(
          "hover:text-secondary-400 flex items-center gap-1 text-base font-medium outline-hidden transition-colors",
          className
        )}
      >
        <span>{mainLink.label}</span>
        <ChevronDown className="h-4 w-4" />
      </StrapiLink>
      <div className="invisible absolute top-full left-0 min-w-max rounded-none bg-white whitespace-nowrap opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
        {subLinks.map((subLink) => (
          <div
            key={subLink.href || subLink.label}
            className="px-2 py-3 hover:bg-black/5"
          >
            <StrapiLink component={subLink} className={cn("cursor-pointer")} />
          </div>
        ))}
      </div>
    </div>
  )
}

NavbarDropdown.displayName = "NavbarDropdown"
