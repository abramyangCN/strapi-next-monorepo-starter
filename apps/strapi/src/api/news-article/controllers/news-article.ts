/**
 * news controller
 */

import { factories } from "@strapi/strapi"

import { generateBreadcrumbs } from "../../../utils/breadcrumbs"

export default factories.createCoreController(
  "api::news-article.news-article",
  ({ strapi }) => ({
    async findOne(ctx) {
      const response = await super.findOne(ctx)

      if (response && response.data) {
        const locale = (ctx.query.locale as string) || "en"
        const article = response.data as {
          title?: string
          name?: string
          slug?: string
          documentId?: string
        }

        let parentBreadcrumbs: { title: string; fullPath: string }[] = [
          { title: "Home", fullPath: "/" },
          { title: "News", fullPath: "/news" },
        ]
        let newsListFullPath = "/news"

        try {
          const newsListPage = await strapi
            .documents("api::page.page")
            .findFirst({
              filters: { isNewsListPage: { $eq: true } },
              fields: [
                "title",
                "breadcrumbTitle",
                "fullPath",
                "documentId",
                "locale",
              ],
              populate: { parent: true },
              locale,
            })

          if (newsListPage) {
            newsListFullPath = newsListPage.fullPath || newsListFullPath
            parentBreadcrumbs = await generateBreadcrumbs(
              // generateBreadcrumbs expects a page document with fullPath/documentId/locale
              newsListPage as never,
              "api::page.page"
            )
          }
        } catch (error) {
          strapi.log.warn("Failed to fetch news page for breadcrumb:", error)
        }

        response.meta = response.meta || {}
        ;(response.meta as Record<string, unknown>).breadcrumbs = [
          ...parentBreadcrumbs,
          {
            title: article.title || article.name || "Article",
            fullPath: `${newsListFullPath}/${article.slug || article.documentId}`,
          },
        ]
      }

      return response
    },
  })
)
