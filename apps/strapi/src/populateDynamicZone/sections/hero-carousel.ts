export default {
  populate: {
    carousels: {
      populate: { media: true, buttons: true },
    },
  },
}
