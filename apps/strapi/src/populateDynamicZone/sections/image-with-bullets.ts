import linkPopulate from "../utilities/link"

export default {
  populate: {
    image: true,
    bullets: {
      populate: {
        link: linkPopulate,
      },
    },
  },
}
