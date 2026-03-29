import { setRequestLocale } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { HeroBanner } from "@/components/elementary/HeroBanner"
import { type NewsArticle, NewsCard } from "@/components/elementary/NewsCard"
import {
  fetchAllNews,
  fetchNewsListPage,
} from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import type { AppLocale } from "@/types/general"

// Force dynamic rendering to avoid prerender errors with client components
export const dynamic = "force-dynamic"

export default async function NewsListPage(props: PageProps<"/[locale]/news">) {
  const params = await props.params
  const locale = params.locale as AppLocale

  setRequestLocale(locale)

  // Fetch page configuration and news articles from Strapi
  const [pageResponse, newsResponse] = await Promise.all([
    fetchNewsListPage(locale),
    fetchAllNews(locale),
  ])

  const pageData = pageResponse?.data as {
    title?: string
    description?: string | null
    sectionTitle?: string
    sectionDescription?: string | null
  } | null
  const newsArticles = (newsResponse?.data ?? []) as NewsArticle[]

  // Get breadcrumbs from API response meta, or use defaults
  const meta = pageResponse?.meta as
    | { breadcrumbs?: { title: string; fullPath: string }[] }
    | undefined
  const breadcrumbs = meta?.breadcrumbs ?? [
    { title: "Home", fullPath: `/${locale}` },
    { title: "News", fullPath: `/${locale}/news` },
  ]

  // Default values if page data is not set
  const title = pageData?.title ?? "Latest Posts"
  const description = pageData?.description
  const sectionTitle = pageData?.sectionTitle ?? "Trending"
  const sectionDescription = pageData?.sectionDescription

  return (
    <main className={cn("flex w-full flex-col overflow-hidden")}>
      {/* Hero Banner */}
      <HeroBanner
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      {/* News Section */}
      <section className="py-16">
        <Container>
          {/* Section Header */}
          <div className="mb-10">
            <h2 className="mb-2 text-3xl font-bold">{sectionTitle}</h2>
            {sectionDescription && (
              <p className="text-muted-foreground">{sectionDescription}</p>
            )}
          </div>

          {/* News Grid */}
          {newsArticles.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {newsArticles.map((news) => (
                <NewsCard key={news.documentId} news={news} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No news articles found.</p>
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
