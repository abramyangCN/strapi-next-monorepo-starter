import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import NewsArticleView from "@/components/layouts/NewsArticleView"
import { isDevelopment } from "@/lib/general-helpers"
import { routing } from "@/lib/navigation"
import { fetchAllNews, fetchNews } from "@/lib/strapi-api/content/server"
import type { AppLocale } from "@/types/general"

// Force dynamic rendering to avoid prerender errors with client components
export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  if (isDevelopment()) {
    // do not prefetch all locales when developing
    return []
  }

  const promises = routing.locales.map((locale) => fetchAllNews(locale))

  const results = await Promise.allSettled(promises)

  const params = results
    .filter((result) => result.status === "fulfilled")
    .flatMap(
      (result) => result.value.data as { locale: string; slug: string }[]
    )
    .map((news) => ({
      locale: news.locale,
      slug: news.slug,
    }))

  return params
}

export async function generateMetadata(
  props: PageProps<"/[locale]/news/[slug]">
): Promise<Metadata> {
  const params = await props.params
  const locale = params.locale as AppLocale
  const slug = params.slug

  const t = await getTranslations({ locale, namespace: "seo" })
  const response = await fetchNews(slug, locale)
  const data = response?.data as Record<string, unknown> & {
    seo?: { metaTitle?: string; metaDescription?: string; keywords?: string }
    title?: string
  }
  const seo = data?.seo

  return {
    title: seo?.metaTitle ?? data?.title ?? t("metaTitle"),
    description: seo?.metaDescription ?? t("metaDescription"),
    keywords: seo?.keywords,
  }
}

export default async function NewsArticlePage(
  props: PageProps<"/[locale]/news/[slug]">
) {
  const params = await props.params
  const locale = params.locale as AppLocale
  const slug = params.slug

  setRequestLocale(locale)

  return <NewsArticleView locale={locale} slug={slug} />
}
