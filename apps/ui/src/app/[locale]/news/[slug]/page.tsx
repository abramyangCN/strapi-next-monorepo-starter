import { ChevronRight } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { Container } from "@/components/elementary/Container"
import { ErrorBoundary } from "@/components/elementary/ErrorBoundary"
import { ShareButtons } from "@/components/elementary/ShareButtons"
import { PageContentComponents } from "@/components/page-builder"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"
import { isDevelopment } from "@/lib/general-helpers"
import { routing } from "@/lib/navigation"
import { fetchAllNews, fetchNews } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
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
    .flatMap((result) => result.value.data)
    .map((news: { locale: string; slug: string }) => ({
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

  const response = await fetchNews(slug, locale)

  const data = response?.data as Record<string, unknown> & {
    content?: ({ __component: string; id: string | number } & Record<
      string,
      unknown
    >)[]
    seo?: {
      metaTitle?: string
      metaDescription?: string
      keywords?: string
      structuredData?: unknown
    }
    title?: string
    category?: string
    publishedAt?: string
    createdAt?: string
  }
  const meta = response?.meta as Record<string, unknown> & {
    breadcrumbs?: { title: string; fullPath: string }[]
  }
  const breadcrumbs = meta?.breadcrumbs

  if (data?.content == null) {
    notFound()
  }

  const { content, ...restPageData } = data

  // Format date
  const publishDate = data.publishedAt || data.createdAt
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null

  return (
    <>
      <StrapiStructuredData structuredData={data?.seo?.structuredData} />

      <main className={cn("flex w-full flex-col overflow-hidden")}>
        <Container>
          {/* Article Header */}
          <header className="py-8 md:py-12">
            {/* Breadcrumb */}
            <Breadcrumbs
              breadcrumbs={
                breadcrumbs || [
                  { title: "Home", fullPath: "/" },
                  { title: "News", fullPath: "/news" },
                  { title: data.category, fullPath: `/news/${slug}` },
                ]
              }
              splitCharacter={
                <ChevronRight className="text-muted-foreground h-4 w-4" />
              }
              className="mb-6 text-black"
              lastBreadcrumbClassName="hover:text-black text-black font-semibold"
            />

            {/* Title */}
            <h1 className="mb-8 text-3xl font-bold md:text-4xl lg:text-5xl">
              {data.title}
            </h1>

            {/* Date and Share */}
            <div className="flex items-center justify-between">
              {formattedDate && (
                <time
                  className="text-muted-foreground text-sm"
                  dateTime={publishDate}
                >
                  {formattedDate}
                </time>
              )}

              {/* Share buttons */}
              <ShareButtons />
            </div>
          </header>
        </Container>

        {content
          .filter(
            (
              comp
            ): comp is { __component: string; id: string | number } & Record<
              string,
              unknown
            > => comp != null
          )
          .map((comp) => {
            const name = comp.__component
            const id = comp.id
            const key = `${name}-${id}`
            const Component =
              PageContentComponents[name as keyof typeof PageContentComponents]
            if (Component == null) {
              console.warn(`Unknown component "${name}" with id "${id}".`)

              return (
                <div key={key} className="font-medium text-red-500">
                  Component &quot;{key}&quot; is not implemented on the
                  frontend.
                </div>
              )
            }

            return (
              <ErrorBoundary key={key}>
                <div className={cn("mb-4 md:mb-12 lg:mb-16")}>
                  <Component
                    component={comp}
                    pageParams={params}
                    page={restPageData}
                  />
                </div>
              </ErrorBoundary>
            )
          })}
      </main>
    </>
  )
}
