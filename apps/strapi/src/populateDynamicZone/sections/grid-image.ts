import linkPopulate from "../utilities/link"

export default {
  populate: {
    link: linkPopulate,
    items: {
      populate: { media: true, link: linkPopulate },
    },
  },
}
