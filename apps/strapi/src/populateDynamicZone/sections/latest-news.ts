import linkPopulate from "../utilities/link"

export default {
  populate: {
    news_articles: {
      populate: { featuredImage: true },
    },
    viewAllButton: linkPopulate,
  },
}
