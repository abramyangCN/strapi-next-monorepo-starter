"use client"

import { ChevronDown } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { Locale } from "next-intl"
import { useTransition } from "react"

import { UseSearchParamsWrapper } from "@/components/helpers/UseSearchParamsWrapper"
import { routing, usePathname, useRouter } from "@/lib/navigation"
import { cn } from "@/lib/styles"

const localeTranslation: Record<string, string> = {
  en: "English",
  fr: "French",
  cn: "中文",
}

function LocaleSwitcher({
  locale,
  className,
  inline = false,
}: {
  locale: Locale
  className?: string
  inline?: boolean
}) {
  return (
    <UseSearchParamsWrapper>
      <SuspensedLocaleSwitcher
        locale={locale}
        className={className}
        inline={inline}
      />
    </UseSearchParamsWrapper>
  )
}

function SuspensedLocaleSwitcher({
  locale,
  className,
  inline = false,
}: {
  locale: Locale
  className?: string
  inline?: boolean
}) {
  // prevent the locale switch from blocking the UI thread
  const [, startTransition] = useTransition()

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLocaleChange = (selectedLocale: Locale) => {
    const queryParams = searchParams.toString()

    // next-intl router.replace does not persist query params
    startTransition(() => {
      router.replace(
        queryParams.length > 0 ? `${pathname}?${queryParams}` : pathname,
        { locale: selectedLocale }
      )
    })
  }

  // Inline mode - display all locales horizontally
  if (inline) {
    return (
      <div className={cn("flex w-full items-center", className)}>
        {routing.locales.map((loc) => (
          <button
            key={loc}
            type="button"
            className={cn(
              "flex-1 px-3 py-2 text-center text-base font-medium uppercase transition-colors",
              loc === locale ? "text-white" : "text-white/60 hover:text-white"
            )}
            onClick={() => handleLocaleChange(loc as Locale)}
          >
            {localeTranslation[loc]}
          </button>
        ))}
      </div>
    )
  }

  // Dropdown mode - default behavior
  return (
    <div className="group relative z-10">
      <button
        type="button"
        className={cn(
          "hover:text-secondary-400 flex items-center gap-1 text-base font-medium uppercase outline-hidden",
          className
        )}
      >
        <span>{localeTranslation[locale]}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      <div className="invisible absolute top-full left-0 z-10 min-w-max rounded-none bg-white whitespace-nowrap opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
        {routing.locales.map((loc) => (
          <div
            key={loc}
            className="hover:text-secondary-400 px-2 py-3 hover:bg-black/5"
          >
            <button
              type="button"
              className={cn("cursor-pointer px-4 py-2")}
              onClick={() => handleLocaleChange(loc as Locale)}
            >
              {localeTranslation[loc]}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocaleSwitcher
