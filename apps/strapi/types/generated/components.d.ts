import type { Schema, Struct } from "@strapi/strapi"

export interface ElementsField extends Struct.ComponentSchema {
  collectionName: "components_elements_fields"
  info: {
    displayName: "Field"
  }
  attributes: {
    key: Schema.Attribute.String
    value: Schema.Attribute.Text
  }
}

export interface ElementsFooterAffiliate extends Struct.ComponentSchema {
  collectionName: "components_elements_footer_affiliates"
  info: {
    displayName: "FooterAffiliate"
  }
  attributes: {
    description: Schema.Attribute.Text
    logo: Schema.Attribute.Component<"utilities.image-with-link", false>
    title: Schema.Attribute.String
  }
}

export interface ElementsFooterContact extends Struct.ComponentSchema {
  collectionName: "components_elements_footer_contacts"
  info: {
    displayName: "FooterContact"
  }
  attributes: {
    address: Schema.Attribute.Text
    email: Schema.Attribute.String
    phone: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface ElementsFooterItem extends Struct.ComponentSchema {
  collectionName: "components_elements_footer_items"
  info: {
    description: ""
    displayName: "FooterItem"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface ElementsOfficeLocation extends Struct.ComponentSchema {
  collectionName: "components_elements_office_locations"
  info: {
    description: "Office location with image, name and address"
    displayName: "OfficeLocation"
  }
  attributes: {
    address: Schema.Attribute.Text & Schema.Attribute.Required
    image: Schema.Attribute.Media<"images">
    location: Schema.Attribute.String
    name: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface ElementsSocialMedia extends Struct.ComponentSchema {
  collectionName: "components_elements_social_medias"
  info: {
    displayName: "SocialMedia"
  }
  attributes: {
    icon: Schema.Attribute.Media<"images">
    link: Schema.Attribute.Component<"utilities.link", false>
    social: Schema.Attribute.Enumeration<
      ["wechat", "instagram", "facebook", "linkedin"]
    >
  }
}

export interface FormsContactForm extends Struct.ComponentSchema {
  collectionName: "components_forms_contact_forms"
  info: {
    displayName: "ContactForm"
  }
  attributes: {
    description: Schema.Attribute.Text
    gdpr: Schema.Attribute.Component<"utilities.link", false>
    title: Schema.Attribute.String
  }
}

export interface FormsNewsletterForm extends Struct.ComponentSchema {
  collectionName: "components_forms_newsletter_forms"
  info: {
    displayName: "Newsletter"
  }
  attributes: {
    button: Schema.Attribute.String
    description: Schema.Attribute.Text
    gdpr: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    placeholder: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface FormsQuotationForm extends Struct.ComponentSchema {
  collectionName: "components_forms_quotation_forms"
  info: {
    description: "Form for quotation requests (Low-volume production & Prototyping)"
    displayName: "QuotationForm"
  }
  attributes: {
    buttonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"FINALIZE MY REQUEST">
    description: Schema.Attribute.Text
    formType: Schema.Attribute.Enumeration<["low-volume", "prototyping"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"low-volume">
    gdpr: Schema.Attribute.Component<"utilities.link", false>
    sampleDocumentLink: Schema.Attribute.Component<"utilities.link", false>
    title: Schema.Attribute.String
  }
}

export interface SectionsAnimatedLogoRow extends Struct.ComponentSchema {
  collectionName: "components_sections_animated_logo_rows"
  info: {
    description: ""
    displayName: "AnimatedLogoRow"
  }
  attributes: {
    logos: Schema.Attribute.Component<"utilities.basic-image", true>
    text: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsAnimatedNumbers extends Struct.ComponentSchema {
  collectionName: "components_sections_animated_numbers"
  info: {
    displayName: "AnimatedNumbers"
  }
  attributes: {
    background: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    numberGroup: Schema.Attribute.Component<"utilities.number-with-text", true>
  }
}

export interface SectionsCarousel extends Struct.ComponentSchema {
  collectionName: "components_sections_carousels"
  info: {
    description: ""
    displayName: "Carousel"
  }
  attributes: {
    images: Schema.Attribute.Component<"utilities.image-with-link", true>
    radius: Schema.Attribute.Enumeration<["sm", "md", "lg", "xl", "full"]>
  }
}

export interface SectionsCarouselWithNext extends Struct.ComponentSchema {
  collectionName: "components_sections_carousel_with_nexts"
  info: {
    displayName: "CarouselWithNext"
  }
  attributes: {
    description: Schema.Attribute.Text
    size: Schema.Attribute.Enumeration<["md", "sm"]> &
      Schema.Attribute.DefaultTo<"md">
    slides: Schema.Attribute.Component<
      "utilities.media-with-texts-and-link",
      true
    >
    title: Schema.Attribute.String
  }
}

export interface SectionsContact extends Struct.ComponentSchema {
  collectionName: "components_sections_contacts"
  info: {
    displayName: "Contact"
  }
  attributes: {
    address: Schema.Attribute.Component<"elements.field", false>
    email: Schema.Attribute.Component<"elements.field", false>
    formTitle: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    gdpr: Schema.Attribute.Component<"utilities.link", false>
    phone: Schema.Attribute.Component<"elements.field", false>
    rightContent: Schema.Attribute.Enumeration<["slogan", "form"]> &
      Schema.Attribute.DefaultTo<"slogan">
    slogan: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    title: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: "components_sections_faqs"
  info: {
    description: ""
    displayName: "Faq"
  }
  attributes: {
    accordions: Schema.Attribute.Component<"utilities.accordions", true>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsFeatureCards extends Struct.ComponentSchema {
  collectionName: "components_sections_feature_cards"
  info: {
    description: "A section displaying feature cards in a grid layout"
    displayName: "Feature Cards"
  }
  attributes: {
    backgroundImage: Schema.Attribute.Media<"images">
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    cards: Schema.Attribute.Component<"utilities.feature-card", true> &
      Schema.Attribute.Required
    columnCount: Schema.Attribute.Enumeration<["2", "3", "4"]> &
      Schema.Attribute.DefaultTo<"3">
    description: Schema.Attribute.Text
    enableBgColor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    title: Schema.Attribute.String
  }
}

export interface SectionsGridImage extends Struct.ComponentSchema {
  collectionName: "components_sections_grid_images"
  info: {
    displayName: "GridImage"
  }
  attributes: {
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    columns: Schema.Attribute.Enumeration<["2", "4"]> &
      Schema.Attribute.DefaultTo<"4">
    description: Schema.Attribute.Text
    enableBgColor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    items: Schema.Attribute.Component<
      "utilities.media-with-texts-and-link",
      true
    >
    link: Schema.Attribute.Component<"utilities.link", false>
    style: Schema.Attribute.Enumeration<["left", "right", "none"]> &
      Schema.Attribute.DefaultTo<"none">
    title: Schema.Attribute.String
  }
}

export interface SectionsHeadingWithCtaButton extends Struct.ComponentSchema {
  collectionName: "components_sections_heading_with_cta_buttons"
  info: {
    description: ""
    displayName: "HeadingWithCTAButton"
  }
  attributes: {
    cta: Schema.Attribute.Component<"utilities.link", false>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: "components_sections_heroes"
  info: {
    description: ""
    displayName: "Hero"
  }
  attributes: {
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    links: Schema.Attribute.Component<"utilities.link", true>
    steps: Schema.Attribute.Component<"utilities.text", true>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsHeroCarousel extends Struct.ComponentSchema {
  collectionName: "components_sections_hero_carousels"
  info: {
    displayName: "HeroCarousel"
  }
  attributes: {
    carousels: Schema.Attribute.Component<
      "utilities.media-with-texts-and-buttons",
      true
    >
  }
}

export interface SectionsHighlightWithList extends Struct.ComponentSchema {
  collectionName: "components_sections_highlight_with_lists"
  info: {
    description: "A section with a highlighted card on the left and text list on the right"
    displayName: "Highlight with List"
  }
  attributes: {
    backgroundImage: Schema.Attribute.Media<"images">
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    enableBgColor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    highlightCard: Schema.Attribute.Component<
      "utilities.highlight-card",
      false
    > &
      Schema.Attribute.Required
    listItems: Schema.Attribute.Component<"utilities.text-block", true>
  }
}

export interface SectionsHorizontalImages extends Struct.ComponentSchema {
  collectionName: "components_sections_horizontal_images"
  info: {
    description: ""
    displayName: "HorizontalImages"
  }
  attributes: {
    fixedImageHeight: Schema.Attribute.Integer
    fixedImageWidth: Schema.Attribute.Integer
    imageRadius: Schema.Attribute.Enumeration<["sm", "md", "lg", "xl", "full"]>
    images: Schema.Attribute.Component<"utilities.image-with-link", true>
    spacing: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 20
          min: 0
        },
        number
      >
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsImageWithBullets extends Struct.ComponentSchema {
  collectionName: "components_sections_image_with_bullets"
  info: {
    displayName: "ImageWithBullets"
  }
  attributes: {
    bullets: Schema.Attribute.Component<"utilities.bullet-list", true>
    description: Schema.Attribute.Text
    image: Schema.Attribute.Media<"images" | "files">
    title: Schema.Attribute.String
  }
}

export interface SectionsImageWithCtaButton extends Struct.ComponentSchema {
  collectionName: "components_sections_image_with_cta_buttons"
  info: {
    description: ""
    displayName: "ImageWithCTAButton"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsImageWithText extends Struct.ComponentSchema {
  collectionName: "components_sections_image_with_texts"
  info: {
    description: "A section with image and rich text content in left-right layout"
    displayName: "Image with Text"
  }
  attributes: {
    backgroundImage: Schema.Attribute.Media<"images">
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    enableBgColor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    image: Schema.Attribute.Media<"images"> & Schema.Attribute.Required
    layout: Schema.Attribute.Enumeration<["left", "right"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"left">
    title: Schema.Attribute.String
  }
}

export interface SectionsLatestNews extends Struct.ComponentSchema {
  collectionName: "components_sections_latest_news"
  info: {
    description: "Section to display latest news articles on homepage"
    displayName: "Latest News"
  }
  attributes: {
    description: Schema.Attribute.Text
    news_articles: Schema.Attribute.Relation<
      "oneToMany",
      "api::news-article.news-article"
    >
    title: Schema.Attribute.String & Schema.Attribute.Required
    viewAllButton: Schema.Attribute.Component<"utilities.link", false>
  }
}

export interface SectionsMediaShowcase extends Struct.ComponentSchema {
  collectionName: "components_sections_media_showcases"
  info: {
    description: "A section to showcase an image or video with optional caption"
    displayName: "Media Showcase"
  }
  attributes: {
    backgroundImage: Schema.Attribute.Media<"images">
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    caption: Schema.Attribute.Text
    enableBgColor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    media: Schema.Attribute.Media<"images" | "videos"> &
      Schema.Attribute.Required
    title: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface SectionsOffice extends Struct.ComponentSchema {
  collectionName: "components_sections_offices"
  info: {
    description: "Display office locations with addresses"
    displayName: "Office"
  }
  attributes: {
    offices: Schema.Attribute.Component<"elements.office-location", true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
  }
}

export interface SectionsStep extends Struct.ComponentSchema {
  collectionName: "components_sections_steps"
  info: {
    displayName: "Step"
  }
  attributes: {
    form1: Schema.Attribute.Component<"utilities.link", false>
    form2: Schema.Attribute.Component<"utilities.link", false>
    steps: Schema.Attribute.Component<"utilities.text-with-number", true>
  }
}

export interface SectionsTextContent extends Struct.ComponentSchema {
  collectionName: "components_sections_text_contents"
  info: {
    description: "A section with rich text content only"
    displayName: "Text Content"
  }
  attributes: {
    backgroundImage: Schema.Attribute.Media<"images">
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    content: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    enableBgColor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    title: Schema.Attribute.String
  }
}

export interface SectionsTimeline extends Struct.ComponentSchema {
  collectionName: "components_sections_timelines"
  info: {
    description: "A vertical timeline showing company history and milestones"
    displayName: "Timeline"
  }
  attributes: {
    bgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    description: Schema.Attribute.Text
    enableBgColor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    items: Schema.Attribute.Component<"utilities.timeline-item", true> &
      Schema.Attribute.Required
    title: Schema.Attribute.String
  }
}

export interface SeoUtilitiesMetaSocial extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_meta_socials"
  info: {
    displayName: "metaSocial"
    icon: "project-diagram"
  }
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 65
      }>
    image: Schema.Attribute.Media<"images" | "files" | "videos">
    socialNetwork: Schema.Attribute.Enumeration<["Facebook", "Twitter"]> &
      Schema.Attribute.Required
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
  }
}

export interface SeoUtilitiesSeo extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seos"
  info: {
    description: ""
    displayName: "Seo"
    icon: "search"
  }
  attributes: {
    applicationName: Schema.Attribute.String
    canonicalUrl: Schema.Attribute.String
    keywords: Schema.Attribute.Text
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
      }>
    metaImage: Schema.Attribute.Media<"images">
    metaRobots: Schema.Attribute.Enumeration<
      [
        "all",
        "index",
        "index,follow",
        "noindex",
        "noindex,follow",
        "noindex,nofollow",
        "none",
        "noarchive",
        "nosnippet",
        "max-snippet",
      ]
    > &
      Schema.Attribute.DefaultTo<"all">
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
    og: Schema.Attribute.Component<"seo-utilities.seo-og", false>
    structuredData: Schema.Attribute.JSON
    twitter: Schema.Attribute.Component<"seo-utilities.seo-twitter", false>
  }
}

export interface SeoUtilitiesSeoOg extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seo_ogs"
  info: {
    displayName: "SeoOg"
    icon: "oneToMany"
  }
  attributes: {
    description: Schema.Attribute.String
    image: Schema.Attribute.Media<"images">
    siteName: Schema.Attribute.String
    title: Schema.Attribute.String
    type: Schema.Attribute.Enumeration<["website", "article"]> &
      Schema.Attribute.DefaultTo<"website">
    url: Schema.Attribute.String
  }
}

export interface SeoUtilitiesSeoTwitter extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_seo_twitters"
  info: {
    displayName: "SeoTwitter"
    icon: "oneToMany"
  }
  attributes: {
    card: Schema.Attribute.String
    creator: Schema.Attribute.String
    creatorId: Schema.Attribute.String
    description: Schema.Attribute.String
    images: Schema.Attribute.Media<"images", true>
    siteId: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface SeoUtilitiesSocialIcons extends Struct.ComponentSchema {
  collectionName: "components_seo_utilities_social_icons"
  info: {
    displayName: "SocialIcons"
  }
  attributes: {
    socials: Schema.Attribute.Component<"utilities.image-with-link", true>
    title: Schema.Attribute.String
  }
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: "components_shared_open_graphs"
  info: {
    displayName: "openGraph"
    icon: "project-diagram"
  }
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200
      }>
    ogImage: Schema.Attribute.Media<"images">
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70
      }>
    ogType: Schema.Attribute.String
    ogUrl: Schema.Attribute.String
  }
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: "components_shared_seos"
  info: {
    displayName: "seo"
    icon: "search"
  }
  attributes: {
    canonicalURL: Schema.Attribute.String
    keywords: Schema.Attribute.Text
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
        minLength: 50
      }>
    metaImage: Schema.Attribute.Media<"images">
    metaRobots: Schema.Attribute.String
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
    metaViewport: Schema.Attribute.String
    openGraph: Schema.Attribute.Component<"shared.open-graph", false>
    structuredData: Schema.Attribute.JSON
  }
}

export interface UtilitiesAccordions extends Struct.ComponentSchema {
  collectionName: "components_utilities_accordions"
  info: {
    description: ""
    displayName: "Accordions"
  }
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required
    question: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface UtilitiesBasicImage extends Struct.ComponentSchema {
  collectionName: "components_utilities_basic_images"
  info: {
    displayName: "BasicImage"
  }
  attributes: {
    alt: Schema.Attribute.String
    fallbackSrc: Schema.Attribute.String
    height: Schema.Attribute.Integer
    media: Schema.Attribute.Media<"images" | "videos"> &
      Schema.Attribute.Required
    width: Schema.Attribute.Integer
  }
}

export interface UtilitiesBulletList extends Struct.ComponentSchema {
  collectionName: "components_utilities_bullet_lists"
  info: {
    displayName: "BulletList"
  }
  attributes: {
    bullet: Schema.Attribute.String
    description: Schema.Attribute.Text
    link: Schema.Attribute.Component<"utilities.link", false>
    title: Schema.Attribute.String
  }
}

export interface UtilitiesButton extends Struct.ComponentSchema {
  collectionName: "components_utilities_buttons"
  info: {
    displayName: "Button"
  }
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required
    label: Schema.Attribute.String & Schema.Attribute.Required
    newTab: Schema.Attribute.Boolean
    theme: Schema.Attribute.Enumeration<["primary", "secondary", "ghost"]>
  }
}

export interface UtilitiesCkEditorContent extends Struct.ComponentSchema {
  collectionName: "components_utilities_ck_editor_contents"
  info: {
    displayName: "CkEditorContent"
  }
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface UtilitiesCkEditorText extends Struct.ComponentSchema {
  collectionName: "components_utilities_ck_editor_texts"
  info: {
    displayName: "CkEditorText"
  }
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "simpleCkEditor"
        }
      >
  }
}

export interface UtilitiesFeatureCard extends Struct.ComponentSchema {
  collectionName: "components_utilities_feature_cards"
  info: {
    description: "A single feature card with title and description"
    displayName: "Feature Card"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface UtilitiesHighlightCard extends Struct.ComponentSchema {
  collectionName: "components_utilities_highlight_cards"
  info: {
    description: "A highlighted card with title, description and button"
    displayName: "Highlight Card"
  }
  attributes: {
    button: Schema.Attribute.Component<"utilities.link", false>
    cardBgColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::color-picker.color">
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    enableCardBgColor: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>
    title: Schema.Attribute.String
  }
}

export interface UtilitiesImageWithLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_image_with_links"
  info: {
    description: ""
    displayName: "ImageWithLink"
  }
  attributes: {
    image: Schema.Attribute.Component<"utilities.basic-image", false>
    link: Schema.Attribute.Component<"utilities.link", false>
  }
}

export interface UtilitiesLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_links"
  info: {
    displayName: "Link"
  }
  attributes: {
    href: Schema.Attribute.String
    label: Schema.Attribute.String
    newTab: Schema.Attribute.Boolean
  }
}

export interface UtilitiesLinkDecorations extends Struct.ComponentSchema {
  collectionName: "components_utilities_link_decorations"
  info: {
    displayName: "LinkDecorations"
  }
  attributes: {
    hasIcons: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>
    leftIcon: Schema.Attribute.Component<"utilities.basic-image", false>
    rightIcon: Schema.Attribute.Component<"utilities.basic-image", false>
    size: Schema.Attribute.Enumeration<
      ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"default">
    variant: Schema.Attribute.Enumeration<
      ["default", "destructive", "outline", "secondary", "ghost", "link"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"link">
  }
}

export interface UtilitiesLinkGroup extends Struct.ComponentSchema {
  collectionName: "components_utilities_link_groups"
  info: {
    displayName: "LinkGroup"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
  }
}

export interface UtilitiesLinksWithTitle extends Struct.ComponentSchema {
  collectionName: "components_utilities_links_with_titles"
  info: {
    displayName: "LinksWithTitle"
  }
  attributes: {
    links: Schema.Attribute.Component<"utilities.link", true>
    title: Schema.Attribute.String
  }
}

export interface UtilitiesMediaWithTextsAndButtons
  extends Struct.ComponentSchema {
  collectionName: "components_utilities_media_with_texts_and_buttons"
  info: {
    displayName: "MediaWithTextsAndButtons"
  }
  attributes: {
    buttons: Schema.Attribute.Component<"utilities.button", true>
    description: Schema.Attribute.Text
    media: Schema.Attribute.Media<"images" | "files" | "videos" | "audios">
    title: Schema.Attribute.Text
  }
}

export interface UtilitiesMediaWithTextsAndLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_media_with_texts_and_links"
  info: {
    displayName: "MediaWithTextsAndLink"
  }
  attributes: {
    description: Schema.Attribute.Text
    link: Schema.Attribute.Component<"utilities.link", false>
    media: Schema.Attribute.Media<"images" | "files" | "videos" | "audios">
    title: Schema.Attribute.String
  }
}

export interface UtilitiesNumberWithText extends Struct.ComponentSchema {
  collectionName: "components_utilities_number_with_texts"
  info: {
    displayName: "NumberWithText"
  }
  attributes: {
    number: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface UtilitiesSubLink extends Struct.ComponentSchema {
  collectionName: "components_utilities_sub_links"
  info: {
    displayName: "SubLink"
  }
  attributes: {
    href: Schema.Attribute.String
    label: Schema.Attribute.String & Schema.Attribute.Required
    links: Schema.Attribute.Component<"utilities.link", true>
    newTab: Schema.Attribute.Boolean
  }
}

export interface UtilitiesText extends Struct.ComponentSchema {
  collectionName: "components_utilities_texts"
  info: {
    displayName: "Text"
  }
  attributes: {
    text: Schema.Attribute.String
  }
}

export interface UtilitiesTextBlock extends Struct.ComponentSchema {
  collectionName: "components_utilities_text_blocks"
  info: {
    description: "A simple text block with title and description"
    displayName: "Text Block"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface UtilitiesTextWithNumber extends Struct.ComponentSchema {
  collectionName: "components_utilities_text_with_numbers"
  info: {
    displayName: "TextWithNumber"
  }
  attributes: {
    number: Schema.Attribute.String
    title: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
  }
}

export interface UtilitiesTimelineItem extends Struct.ComponentSchema {
  collectionName: "components_utilities_timeline_items"
  info: {
    description: "A single timeline event with year, title, description and optional image"
    displayName: "Timeline Item"
  }
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        "plugin::ckeditor5.CKEditor",
        {
          preset: "defaultCkEditor"
        }
      >
    dotColor: Schema.Attribute.Enumeration<["primary", "secondary"]> &
      Schema.Attribute.DefaultTo<"primary">
    image: Schema.Attribute.Media<"images">
    title: Schema.Attribute.String
    year: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface UtilitiesTipTapRichText extends Struct.ComponentSchema {
  collectionName: "components_utilities_tip_tap_rich_texts"
  info: {
    displayName: "TipTapRichText"
    icon: "layer"
  }
  attributes: {
    content: Schema.Attribute.Text &
      Schema.Attribute.CustomField<"plugin::tiptap-editor.RichText">
  }
}

declare module "@strapi/strapi" {
  export module Public {
    export interface ComponentSchemas {
      "elements.field": ElementsField
      "elements.footer-affiliate": ElementsFooterAffiliate
      "elements.footer-contact": ElementsFooterContact
      "elements.footer-item": ElementsFooterItem
      "elements.office-location": ElementsOfficeLocation
      "elements.social-media": ElementsSocialMedia
      "forms.contact-form": FormsContactForm
      "forms.newsletter-form": FormsNewsletterForm
      "forms.quotation-form": FormsQuotationForm
      "sections.animated-logo-row": SectionsAnimatedLogoRow
      "sections.animated-numbers": SectionsAnimatedNumbers
      "sections.carousel": SectionsCarousel
      "sections.carousel-with-next": SectionsCarouselWithNext
      "sections.contact": SectionsContact
      "sections.faq": SectionsFaq
      "sections.feature-cards": SectionsFeatureCards
      "sections.grid-image": SectionsGridImage
      "sections.heading-with-cta-button": SectionsHeadingWithCtaButton
      "sections.hero": SectionsHero
      "sections.hero-carousel": SectionsHeroCarousel
      "sections.highlight-with-list": SectionsHighlightWithList
      "sections.horizontal-images": SectionsHorizontalImages
      "sections.image-with-bullets": SectionsImageWithBullets
      "sections.image-with-cta-button": SectionsImageWithCtaButton
      "sections.image-with-text": SectionsImageWithText
      "sections.latest-news": SectionsLatestNews
      "sections.media-showcase": SectionsMediaShowcase
      "sections.office": SectionsOffice
      "sections.step": SectionsStep
      "sections.text-content": SectionsTextContent
      "sections.timeline": SectionsTimeline
      "seo-utilities.meta-social": SeoUtilitiesMetaSocial
      "seo-utilities.seo": SeoUtilitiesSeo
      "seo-utilities.seo-og": SeoUtilitiesSeoOg
      "seo-utilities.seo-twitter": SeoUtilitiesSeoTwitter
      "seo-utilities.social-icons": SeoUtilitiesSocialIcons
      "shared.open-graph": SharedOpenGraph
      "shared.seo": SharedSeo
      "utilities.accordions": UtilitiesAccordions
      "utilities.basic-image": UtilitiesBasicImage
      "utilities.bullet-list": UtilitiesBulletList
      "utilities.button": UtilitiesButton
      "utilities.ck-editor-content": UtilitiesCkEditorContent
      "utilities.ck-editor-text": UtilitiesCkEditorText
      "utilities.feature-card": UtilitiesFeatureCard
      "utilities.highlight-card": UtilitiesHighlightCard
      "utilities.image-with-link": UtilitiesImageWithLink
      "utilities.link": UtilitiesLink
      "utilities.link-decorations": UtilitiesLinkDecorations
      "utilities.link-group": UtilitiesLinkGroup
      "utilities.links-with-title": UtilitiesLinksWithTitle
      "utilities.media-with-texts-and-buttons": UtilitiesMediaWithTextsAndButtons
      "utilities.media-with-texts-and-link": UtilitiesMediaWithTextsAndLink
      "utilities.number-with-text": UtilitiesNumberWithText
      "utilities.sub-link": UtilitiesSubLink
      "utilities.text": UtilitiesText
      "utilities.text-block": UtilitiesTextBlock
      "utilities.text-with-number": UtilitiesTextWithNumber
      "utilities.timeline-item": UtilitiesTimelineItem
      "utilities.tip-tap-rich-text": UtilitiesTipTapRichText
    }
  }
}
