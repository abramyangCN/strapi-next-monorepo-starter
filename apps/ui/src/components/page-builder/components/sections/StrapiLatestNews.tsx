import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { type NewsArticle, NewsCard } from "@/components/elementary/NewsCard"
import { Section } from "@/components/elementary/Section"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import {
  StrapiSectionDescription,
  StrapiSectionTitle,
} from "@/components/page-builder/components/utilities/StrapiSectionHeader"
import type { AppLocale } from "@/types/general"

interface StrapiLatestNewsProps {
  readonly component: Data.Component<"sections.latest-news">
  readonly pageParams?: { locale: AppLocale }
}

export function StrapiLatestNews({
  component,
  pageParams,
}: StrapiLatestNewsProps) {
  const locale = pageParams?.locale || "en"

  // Get up to 3 news articles
  const newsArticles = (component.news_articles?.slice(0, 3) ??
    []) as NewsArticle[]

  if (newsArticles.length === 0) {
    return null
  }

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col justify-center lg:items-center">
          <StrapiSectionTitle title={component.title} />
          <StrapiSectionDescription description={component.description} />
        </div>

        {/* News Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((news) => (
            <NewsCard key={news.documentId} news={news} locale={locale} />
          ))}
        </div>

        {/* View All Button */}
        {component.viewAllButton && (
          <div className="flex justify-center">
            <StrapiLink variant="primary" component={component.viewAllButton} />
          </div>
        )}
      </Container>
    </Section>
  )
}

StrapiLatestNews.displayName = "StrapiLatestNews"

export default StrapiLatestNews
