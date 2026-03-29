import type { Locale } from "next-intl"
import { getLocale } from "next-intl/server"
import parse from "node-html-parser"

import { processLinkHrefAttribute } from "@/components/elementary/ck-editor/utils"
import { cn } from "@/lib/styles"

import "@/styles/CkEditorDefaultStyles.css"
import "server-only"

function processHtmlContent(html: string, locale: string) {
  const doc = parse(html)

  const links = doc.getElementsByTagName("a")

  for (const link of links) {
    const href = link.getAttribute("href")
    if (href?.startsWith("/")) {
      link.setAttribute(
        "href",
        processLinkHrefAttribute(href, locale as Locale)
      )
    }
  }

  const tagNames = ["h1", "h2", "h3", "h4", "h5", "h6", "p"]
  for (const tagName of tagNames) {
    const elements = doc.getElementsByTagName(tagName)
    for (const element of elements) {
      element.classList.add(`typo-${tagName}`)
    }
  }

  return doc.innerHTML
}

async function CkEditorSSRRenderer({
  htmlContent,
  className,
  variant = "page",
}: {
  htmlContent?: string | null
  className?: string
  variant?: "page" | "blog"
}) {
  const locale = await getLocale()

  // processHtmlContent defined at module scope

  return htmlContent ? (
    <div
      className={cn(
        variant === "page" ? "ck-editor-rich-text-page ck-content" : "",
        className
      )}
      // Content is coming from Strapi, i.e. from employees, not users
      dangerouslySetInnerHTML={{
        __html: htmlContent ? processHtmlContent(htmlContent, locale) : "",
      }}
    />
  ) : null
}

export default CkEditorSSRRenderer
