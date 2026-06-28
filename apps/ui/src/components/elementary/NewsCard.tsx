import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { routing } from "@/lib/navigation"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import type { StrapiImageMedia } from "@/types/api"

export interface NewsArticle {
  id: number
  documentId: string
  slug: string
  title: string
  excerpt?: string
  category?: string
  featuredImage?: StrapiImageMedia
  createdAt: string
  updatedAt: string
}

interface NewsCardProps {
  news: NewsArticle
  locale: string
  basePath?: string
}

export function NewsCard({ news, locale, basePath = "/news" }: NewsCardProps) {
  const t = useTranslations("comps.newsCard")
  const imageUrl = news.featuredImage?.url
    ? formatStrapiMediaUrl(news.featuredImage.url)
    : null
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`
  const newsHref = `${localePrefix}${basePath}/${news.slug}`

  return (
    <article className="group flex flex-col">
      {/* Image */}
      <Link
        href={newsHref}
        className="bg-muted relative mb-4 aspect-[16/10] overflow-hidden"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={news.featuredImage?.alternativeText || news.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
      </Link>

      {/* Category */}
      {news.category && (
        <span className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          {news.category}
        </span>
      )}

      {/* Title */}
      <Link href={newsHref}>
        <h3 className="group-hover:text-secondary-400 mb-2 text-lg leading-tight font-semibold transition-colors">
          {news.title}
        </h3>
      </Link>

      {/* Excerpt */}
      {news.excerpt && (
        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
          {news.excerpt}
        </p>
      )}

      {/* Read more link */}
      <Link
        href={newsHref}
        className="group/link text-foreground hover:text-primary mt-auto inline-flex items-center text-sm font-medium transition-colors"
      >
        {t("readMore")}
        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
      </Link>
    </article>
  )
}
