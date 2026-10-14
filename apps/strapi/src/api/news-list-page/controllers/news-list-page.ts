/**
 * news-list-page controller
 */

import { ROOT_PAGE_PATH } from "@repo/shared-data"
import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::news-list-page.news-list-page",
  () => ({
    async find(ctx) {
      const { data, meta } = await super.find(ctx)

      if (data) {
        // Generate breadcrumbs for news list page
        const slug = data.slug || "news"
        meta.breadcrumbs = [
          {
            title: "Home",
            fullPath: ROOT_PAGE_PATH,
          },
          {
            title: data.breadcrumbTitle || data.title || "News",
            fullPath: `/${slug}`,
          },
        ]
      }

      return { data, meta }
    },
  })
)
