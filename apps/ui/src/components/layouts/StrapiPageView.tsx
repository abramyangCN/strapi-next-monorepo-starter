import { ROOT_PAGE_PATH } from "@repo/shared-data"
import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"

import { ErrorBoundary } from "@/components/elementary/ErrorBoundary"
import NewsArticleView from "@/components/layouts/NewsArticleView"
import { PageContentComponents } from "@/components/page-builder"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"
import { fetchNewsByFullPath, fetchPage } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

interface Props {
  params: {
    locale: string
    rest?: string[]
  }
  searchParams?: Record<string, string | string[] | undefined>
}

export default async function StrapiPageView({ params, searchParams }: Props) {
  const locale = params.locale as Locale

  setRequestLocale(locale)

  const fullPath = ROOT_PAGE_PATH + (params.rest ?? []).join("/")
  const response = await fetchPage(fullPath, locale)

  const data = response?.data

  if (data?.content == null) {
    const newsResponse = await fetchNewsByFullPath(fullPath, locale)

    if (newsResponse?.data) {
      const articleSlug = fullPath.split("/").findLast(Boolean)

      if (articleSlug) {
        return <NewsArticleView locale={locale} slug={articleSlug} />
      }
    }

    notFound()
  }

  const { content, ...restPageData } = data

  return (
    <>
      <StrapiStructuredData structuredData={data?.seo?.structuredData} />

      <main className={cn("flex w-full flex-col overflow-hidden")}>
        {content
          .filter((comp) => comp != null)
          .map((comp) => {
            const name = comp.__component
            const id = comp.id
            const key = `${name}-${id}`
            const Component = PageContentComponents[name]
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
                    meta={response?.meta}
                    searchParams={searchParams}
                  />
                </div>
              </ErrorBoundary>
            )
          })}
      </main>
    </>
  )
}
