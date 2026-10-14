import "server-only"

import type { UID } from "@repo/strapi-types"
import { draftMode } from "next/headers"
import type { Locale } from "next-intl"

import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"
import type { CustomFetchOptions } from "@/types/general"

// ------ SEO populate object

const seoPopulate = {
  populate: {
    metaImage: true,
    twitter: { populate: { images: true } },
    og: { populate: { image: true } },
  },
}

// ------ Page fetching functions

export async function fetchPage(
  fullPath: string,
  locale: Locale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  const dm = await draftMode()

  try {
    return await PublicStrapiClient.fetchOneByFullPath(
      "api::page.page",
      fullPath,
      {
        locale,
        status: dm.isEnabled ? "draft" : "published",
        populate: { seo: seoPopulate },
        populateDynamicZone: { content: true },
      },
      requestInit,
      options
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching page '${fullPath}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

export async function fetchAllPages(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  locale: Locale
) {
  try {
    return await PublicStrapiClient.fetchAll(uid, {
      locale,
      fields: ["fullPath", "locale", "updatedAt", "createdAt", "slug"],
      populate: {},
      status: "published",
    })
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching all pages for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return { data: [] }
  }
}

export async function fetchNewsRootPage(locale: Locale) {
  try {
    const legacyResponse = await PublicStrapiClient.fetchMany(
      "api::page.page",
      {
        locale,
        filters: {
          isNewsListPage: {
            $eq: true,
          },
        },
        fields: [
          "title",
          "breadcrumbTitle",
          "fullPath",
          "slug",
          "locale",
          "documentId",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any,
        status: "published",
      }
    )

    if (legacyResponse.data[0] != null) {
      return legacyResponse.data[0]
    }

    const newsListPageResponse = await PublicStrapiClient.fetchOne(
      "api::news-list-page.news-list-page",
      undefined,
      {
        locale,
        fields: [
          "title",
          "breadcrumbTitle",
          "slug",
          "locale",
          "documentId",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any,
        status: "published",
      }
    )

    const newsListPage = newsListPageResponse?.data as {
      title?: string | null
      breadcrumbTitle?: string | null
      slug?: string | null
      locale?: string | null
      documentId?: string | null
    } | null

    if (newsListPage == null) {
      return null
    }

    const slug = newsListPage.slug?.replace(/^\/+/, "") || "news"

    return {
      ...newsListPage,
      fullPath: `/${slug}`,
    }
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching news root page for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }

  return null
}

// ------ SEO fetching functions

export async function fetchSeo(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  fullPath: string | null,
  locale: Locale
) {
  try {
    return await PublicStrapiClient.fetchOneByFullPath(uid, fullPath, {
      locale,
      populate: {
        seo: seoPopulate,
        localizations: true,
      },
    })
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching SEO for '${uid}' with fullPath '${fullPath}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ Navbar fetching functions

export async function fetchNavbar(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne("api::navbar.navbar", undefined, {
      locale,
      populate: {
        links: {
          populate: {
            links: true,
          },
        },
        logoImage: { populate: { image: { populate: "*" }, link: true } },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching navbar for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ Footer fetching functions

export async function fetchFooter(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne("api::footer.footer", undefined, {
      locale,
      populate: {
        newsletter: true,
        affiliates: {
          populate: {
            logo: {
              populate: { image: { populate: { media: true } }, link: true },
            },
          },
        },
        sections: {
          populate: {
            links: true,
          },
        },
        contact: true,
        socialMedias: { populate: { link: true, icon: true } },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching footer for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ News fetching functions

export async function fetchNews(
  slug: string,
  locale: Locale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  const dm = await draftMode()

  try {
    const response = await PublicStrapiClient.fetchOneBySlug(
      "api::news-article.news-article" as UID.ContentType,
      slug,
      {
        locale,
        status: dm.isEnabled ? "draft" : "published",
        populate: {
          content: true,
          seo: seoPopulate,
          featuredImage: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        populateDynamicZone: { content: true },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      requestInit,
      options
    )

    if (response.data == null) {
      return response
    }

    const article = response.data as {
      title?: string | null
      slug?: string | null
    }

    const newsRootPage = await fetchNewsRootPage(locale)

    if (!newsRootPage?.fullPath) {
      return response
    }

    const newsRootResponse = await fetchPage(
      newsRootPage.fullPath,
      locale,
      requestInit,
      options
    )

    const parentBreadcrumbs = (
      newsRootResponse?.meta as {
        breadcrumbs?: { title: string; fullPath: string }[]
      }
    )?.breadcrumbs ?? [
      {
        title: newsRootPage.breadcrumbTitle ?? newsRootPage.title ?? "News",
        fullPath: newsRootPage.fullPath,
      },
    ]

    return {
      ...response,
      meta: {
        ...response.meta,
        breadcrumbs: [
          ...parentBreadcrumbs,
          {
            title: article.title ?? "Article",
            fullPath: `${newsRootPage.fullPath.replace(/\/$/, "")}/${article.slug ?? slug}`,
          },
        ],
      },
    }
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching news '${slug}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

export async function fetchNewsByFullPath(fullPath: string, locale: Locale) {
  const newsRootPage = await fetchNewsRootPage(locale)

  if (!newsRootPage?.fullPath) {
    return null
  }

  const newsRootFullPath = newsRootPage.fullPath.replace(/\/$/, "")
  const normalizedFullPath = fullPath.replace(/\/$/, "")

  if (!normalizedFullPath.startsWith(`${newsRootFullPath}/`)) {
    return null
  }

  const slug = normalizedFullPath.slice(newsRootFullPath.length + 1)

  if (!slug || slug.includes("/")) {
    return null
  }

  return fetchNews(slug, locale)
}

export async function fetchAllNews(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchAll(
      "api::news-article.news-article" as UID.ContentType,
      {
        locale,
        fields: [
          "slug",
          "locale",
          "updatedAt",
          "createdAt",
          "title",
          "excerpt",
          "category",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any,
        populate: {
          featuredImage: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        status: "published",
        sort: ["createdAt:desc"],
      }
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching all news for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return { data: [] }
  }
}
