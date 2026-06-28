import type { Data } from "@repo/strapi-types"
import { ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"

import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { Container } from "@/components/elementary/Container"
import { ErrorBoundary } from "@/components/elementary/ErrorBoundary"
import { ShareButtons } from "@/components/elementary/ShareButtons"
import { PageContentComponents } from "@/components/page-builder"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"
import { fetchFooter, fetchNews } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import type { AppLocale } from "@/types/general"

export default async function NewsArticleView({
  locale,
  slug,
}: {
  locale: AppLocale
  slug: string
}) {
  const [response, footerResponse] = await Promise.all([
    fetchNews(slug, locale),
    fetchFooter(locale),
  ])

  const footerData = footerResponse?.data as {
    socialMedias?: Data.Component<"elements.social-media">[]
  } | null
  const socialMedias = footerData?.socialMedias?.filter(
    (s) => s.social !== "wechat"
  )

  const data = response?.data as Record<string, unknown> & {
    content?: ({ __component: string; id: string | number } & Record<
      string,
      unknown
    >)[]
    seo?: {
      structuredData?: unknown
    }
    title?: string
    publishedAt?: string
    createdAt?: string
  }
  const meta = response?.meta as Record<string, unknown> & {
    breadcrumbs?: { title: string; fullPath: string }[]
  }

  if (data?.content == null) {
    notFound()
  }

  const { content, ...restPageData } = data
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
      <StrapiStructuredData
        structuredData={
          data?.seo
            ?.structuredData as Data.Component<"seo-utilities.seo">["structuredData"]
        }
      />

      <main className={cn("flex w-full flex-col overflow-hidden")}>
        <Container>
          <header className="py-8 md:py-12">
            <Breadcrumbs
              breadcrumbs={meta?.breadcrumbs}
              splitCharacter={
                <ChevronRight className="text-muted-foreground h-4 w-4" />
              }
              className="mb-6 text-black"
              lastBreadcrumbClassName="hover:text-black text-black font-semibold"
            />

            <h1 className="mb-8 text-3xl font-bold md:text-4xl lg:text-5xl">
              {data.title}
            </h1>

            <div className="flex items-center justify-between">
              {formattedDate && (
                <time
                  className="text-muted-foreground text-lg font-bold"
                  dateTime={publishDate}
                >
                  {formattedDate}
                </time>
              )}

              <ShareButtons socialMedias={socialMedias} />
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
                    pageParams={{ locale, slug }}
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
