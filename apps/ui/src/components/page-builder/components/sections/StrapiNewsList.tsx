import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { type NewsArticle, NewsCard } from "@/components/elementary/NewsCard"
import { Section } from "@/components/elementary/Section"
import { fetchAllNews } from "@/lib/strapi-api/content/server"
import type { AppLocale } from "@/types/general"

interface StrapiNewsListProps {
  readonly component: Data.Component<"sections.news-list">
  readonly pageParams?: { locale: AppLocale }
  readonly page?: { fullPath?: string | null }
}

export async function StrapiNewsList({
  component,
  pageParams,
  page,
}: StrapiNewsListProps) {
  const locale = pageParams?.locale || "en"
  const basePath = page?.fullPath || "/news"
  const newsArticles = ((await fetchAllNews(locale))?.data ??
    []) as NewsArticle[]

  return (
    <Section>
      <Container>
        <div className="mb-10">
          <h2 className="mb-2 text-3xl font-bold">{component.sectionTitle}</h2>
          {component.sectionDescription && (
            <p className="text-muted-foreground">
              {component.sectionDescription}
            </p>
          )}
        </div>

        {newsArticles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsArticles.map((news) => (
              <NewsCard
                key={news.documentId}
                news={news}
                locale={locale}
                basePath={basePath}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No news articles found.</p>
          </div>
        )}
      </Container>
    </Section>
  )
}

StrapiNewsList.displayName = "StrapiNewsList"

export default StrapiNewsList
