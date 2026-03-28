/**
 * news controller
 */

import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::news-article.news-article",
  ({ strapi }) => ({
    async findOne(ctx) {
      const response = await super.findOne(ctx)

      if (response && response.data) {
        const locale = (ctx.query.locale as string) || "en"
        const article = response.data as any

        // 获取 news-list-page 的面包屑标题
        let newsListTitle = "News"
        try {
          const newsListPage = await strapi
            .documents("api::news-list-page.news-list-page")
            .findFirst({
              locale,
              fields: ["breadcrumbTitle", "title"],
            })
          if (newsListPage) {
            newsListTitle =
              newsListPage.breadcrumbTitle || newsListPage.title || "News"
          }
        } catch (error) {
          strapi.log.warn(
            "Failed to fetch news-list-page for breadcrumb:",
            error
          )
        }

        // 生成面包屑
        response.meta = response.meta || {}
        ;(response.meta as any).breadcrumbs = [
          { title: "Home", fullPath: "/" },
          { title: newsListTitle, fullPath: "/news" },
          {
            title: article.title || article.name || "Article",
            fullPath: `/news/${article.slug || article.documentId}`,
          },
        ]
      }

      return response
    },
  })
)
