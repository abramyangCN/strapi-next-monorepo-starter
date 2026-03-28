import type { UID } from "@repo/strapi-types"

import StrapiContactForm from "@/components/page-builder/components/forms/StrapiContactForm"
import StrapiNewsletterForm from "@/components/page-builder/components/forms/StrapiNewsletterForm"
import StrapiQuotationForm from "@/components/page-builder/components/forms/StrapiQuotationForm"
import StrapiAnimatedLogoRow from "@/components/page-builder/components/sections/StrapiAnimatedLogoRow"
import StrapiAnimatedNumbers from "@/components/page-builder/components/sections/StrapiAnimatedNumbers"
import StrapiCarousel from "@/components/page-builder/components/sections/StrapiCarousel"
import StrapiCarouselWithNext from "@/components/page-builder/components/sections/StrapiCarouselWithNext"
import StrapiContact from "@/components/page-builder/components/sections/StrapiContact"
import StrapiFaq from "@/components/page-builder/components/sections/StrapiFaq"
import StrapiFeatureCards from "@/components/page-builder/components/sections/StrapiFeatureCards"
import StrapiGridImage from "@/components/page-builder/components/sections/StrapiGridImage"
import StrapiHeadingWithCTAButton from "@/components/page-builder/components/sections/StrapiHeadingWithCTAButton"
import StrapiHero from "@/components/page-builder/components/sections/StrapiHero"
import StrapiHeroCarousel from "@/components/page-builder/components/sections/StrapiHeroCarousel"
import StrapiHighlightWithList from "@/components/page-builder/components/sections/StrapiHighlightWithList"
import StrapiHorizontalImages from "@/components/page-builder/components/sections/StrapiHorizontalImages"
import StrapiImageWithBullets from "@/components/page-builder/components/sections/StrapiImageWithBullets"
import StrapiImageWithCTAButton from "@/components/page-builder/components/sections/StrapiImageWithCTAButton"
import StrapiImageWithText from "@/components/page-builder/components/sections/StrapiImageWithText"
import StrapiLatestNews from "@/components/page-builder/components/sections/StrapiLatestNews"
import StrapiMediaShowcase from "@/components/page-builder/components/sections/StrapiMediaShowcase"
import StrapiOffice from "@/components/page-builder/components/sections/StrapiOffice"
import StrapiStep from "@/components/page-builder/components/sections/StrapiStep"
import StrapiTextContent from "@/components/page-builder/components/sections/StrapiTextContent"
import StrapiTimeline from "@/components/page-builder/components/sections/StrapiTimeline"
import StrapiCkEditorContent from "@/components/page-builder/components/utilities/StrapiCkEditorContent"
import StrapiTipTapEditorContent from "@/components/page-builder/components/utilities/StrapiTipTapEditorContent"

/**
 * Mapping of Strapi Component UID to React Component
 *
 * Consider improving dynamic/lazy loading of these components to reduce bundle size.
 */
export const PageContentComponents: Partial<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic component map requires any for varying prop types
  Record<UID.Component, React.ComponentType<any>>
> = {
  // elements, seo-utilities, utilities
  // They are usually rendered or used deep inside other components or handlers
  // Add them here if they can be used on Page content level
  "utilities.ck-editor-content": StrapiCkEditorContent,
  "utilities.ck-editor-text": StrapiCkEditorContent,
  "utilities.tip-tap-rich-text": StrapiTipTapEditorContent,

  // Sections
  "sections.animated-logo-row": StrapiAnimatedLogoRow,
  "sections.animated-numbers": StrapiAnimatedNumbers,
  "sections.carousel": StrapiCarousel,
  "sections.carousel-with-next": StrapiCarouselWithNext,
  "sections.contact": StrapiContact,
  "sections.faq": StrapiFaq,
  "sections.feature-cards": StrapiFeatureCards,
  "sections.grid-image": StrapiGridImage,
  "sections.heading-with-cta-button": StrapiHeadingWithCTAButton,
  "sections.hero": StrapiHero,
  "sections.hero-carousel": StrapiHeroCarousel,
  "sections.highlight-with-list": StrapiHighlightWithList,
  "sections.horizontal-images": StrapiHorizontalImages,
  "sections.image-with-bullets": StrapiImageWithBullets,
  "sections.image-with-cta-button": StrapiImageWithCTAButton,
  "sections.image-with-text": StrapiImageWithText,
  "sections.latest-news": StrapiLatestNews,
  "sections.media-showcase": StrapiMediaShowcase,
  "sections.office": StrapiOffice,
  "sections.step": StrapiStep,
  "sections.text-content": StrapiTextContent,
  "sections.timeline": StrapiTimeline,

  // Forms
  "forms.contact-form": StrapiContactForm,
  "forms.newsletter-form": StrapiNewsletterForm,
  "forms.quotation-form": StrapiQuotationForm,

  // Add more components here
}
