import linkPopulate from "../utilities/link"

export default {
  populate: {
    slides: {
      populate: { media: true, link: linkPopulate },
    },
  },
}
