import type { Locale } from "next-intl"
import type React from "react"

import AppLink from "@/components/elementary/AppLink"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"
import { generateBreadcrumbListSchema } from "@/lib/metadata/schemas"
import { cn } from "@/lib/styles"
import type { BreadCrumb } from "@/types/api"

interface Props {
  readonly breadcrumbs?: BreadCrumb[]
  readonly className?: string
  readonly locale?: Locale
  readonly lastBreadcrumbClassName?: string
  readonly splitCharacter?: string | React.ReactNode
}

export function Breadcrumbs({
  breadcrumbs,
  className,
  locale,
  lastBreadcrumbClassName,
  splitCharacter = " ",
}: Props) {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }

  const breadcrumbListSchema = locale
    ? generateBreadcrumbListSchema(breadcrumbs, locale)
    : null

  return (
    <div
      className={cn(
        "max-w-screen-default mx-auto flex w-full items-center text-white",
        className
      )}
    >
      {breadcrumbListSchema && (
        <StrapiStructuredData structuredData={breadcrumbListSchema} />
      )}
      {breadcrumbs.map((breadcrumb, index) => (
        <div className="flex" key={breadcrumb.fullPath}>
          {index !== 0 && (
            <div className={cn("tracking-sm mx-2 inline-flex items-center")}>
              {splitCharacter}
            </div>
          )}

          {index !== breadcrumbs.length - 1 ? (
            <AppLink
              href={breadcrumb.fullPath}
              className={cn(
                "tracking-sm hover:text-secondary-400 inline-block h-auto p-0 text-xs leading-[18px] hover:no-underline md:text-sm md:leading-[21px]"
              )}
            >
              {breadcrumb.title}
            </AppLink>
          ) : (
            <span
              className={cn(
                "tracking-sm text-secondary-400 inline-block text-xs leading-[18px] wrap-break-word md:text-sm md:leading-[21px]",
                lastBreadcrumbClassName
              )}
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                display: "inline",
              }}
            >
              {breadcrumb.title}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
