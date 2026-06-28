const frontendToStrapiLocaleMap: Record<string, string> = {
  cn: "zh-CN",
}

const strapiToFrontendLocaleMap = Object.fromEntries(
  Object.entries(frontendToStrapiLocaleMap).map(
    ([frontendLocale, strapiLocale]) => [
      strapiLocale.toLowerCase(),
      frontendLocale,
    ]
  )
)

export function toStrapiLocale(locale: string | null | undefined) {
  if (!locale) {
    return locale
  }

  return frontendToStrapiLocaleMap[locale] ?? locale
}

export function toFrontendLocale(locale: string | null | undefined) {
  if (!locale) {
    return locale
  }

  return strapiToFrontendLocaleMap[locale.toLowerCase()] ?? locale
}

export function normalizeStrapiResponseLocales<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeStrapiResponseLocales(item)) as T
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        if (key === "locale" && typeof nestedValue === "string") {
          return [key, toFrontendLocale(nestedValue)]
        }

        return [key, normalizeStrapiResponseLocales(nestedValue)]
      })
    ) as T
  }

  return value
}
